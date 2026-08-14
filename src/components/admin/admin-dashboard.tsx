"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  AdminFolder,
  AdminMedia,
  AdminOrder,
  FolderKind,
  OrderStatus,
} from "@/lib/admin-types";
import { AdminKpiStrip } from "./admin-kpi";
import { AdminMediaPanel } from "./admin-media-panel";
import { AdminOrdersPanel } from "./admin-orders-panel";
import { AdminShell, type StorageInfo } from "./admin-shell";
import { AdminToastProvider, useAdminToast } from "./admin-toast";
import {
  type AdminTab,
  readStoredTab,
  writeStoredTab,
} from "./admin-utils";

function AdminDashboardInner() {
  const router = useRouter();
  const { toast } = useAdminToast();
  const [tab, setTab] = useState<AdminTab>("media");
  const [tabReady, setTabReady] = useState(false);
  const [folders, setFolders] = useState<AdminFolder[]>([]);
  const [media, setMedia] = useState<AdminMedia[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTab(readStoredTab());
    setTabReady(true);
  }, []);

  const loadAll = useCallback(async () => {
    setError(null);
    const [foldersRes, mediaRes, ordersRes] = await Promise.all([
      fetch("/api/admin/folders"),
      fetch("/api/admin/media"),
      fetch("/api/admin/orders"),
    ]);

    if (
      foldersRes.status === 401 ||
      mediaRes.status === 401 ||
      ordersRes.status === 401
    ) {
      router.replace("/admin/login");
      return;
    }

    const foldersData = (await foldersRes.json()) as {
      folders?: AdminFolder[];
      storage?: StorageInfo;
      error?: string;
    };
    const mediaData = (await mediaRes.json()) as {
      media?: AdminMedia[];
      storage?: StorageInfo;
      error?: string;
    };
    const ordersData = (await ordersRes.json()) as {
      orders?: AdminOrder[];
      error?: string;
    };

    if (!foldersRes.ok) {
      throw new Error(foldersData.error || "Failed to load folders.");
    }
    if (!mediaRes.ok) {
      throw new Error(mediaData.error || "Failed to load media.");
    }
    if (!ordersRes.ok) {
      throw new Error(ordersData.error || "Failed to load orders.");
    }

    setFolders(foldersData.folders || []);
    setMedia(mediaData.media || []);
    setOrders(ordersData.orders || []);
    setStorage(foldersData.storage || mediaData.storage || null);
    setSelectedFolderId((prev) => {
      if (prev && (foldersData.folders || []).some((f) => f.id === prev)) {
        return prev;
      }
      return foldersData.folders?.[0]?.id ?? null;
    });
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        await loadAll();
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load admin data."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadAll]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/") return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }
      e.preventDefault();
      if (tab !== "orders") {
        setTab("orders");
        writeStoredTab("orders");
      }
      window.setTimeout(() => searchRef.current?.focus(), 50);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tab]);

  async function refresh() {
    setRefreshing(true);
    try {
      await loadAll();
      toast("Desk refreshed");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to refresh.";
      setError(message);
      toast(message, "error");
    } finally {
      setRefreshing(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function createFolder(name: string, kind: FolderKind) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, kind }),
      });
      const data = (await res.json()) as {
        folder?: AdminFolder;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Could not create folder.");
      await loadAll();
      if (data.folder) setSelectedFolderId(data.folder.id);
      toast("Folder created");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not create folder.";
      setError(message);
      toast(message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function removeFolder(id: string) {
    if (!confirm("Delete this folder and all media inside it?")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/folders?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not delete folder.");
      await loadAll();
      toast("Folder deleted");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not delete folder.";
      setError(message);
      toast(message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function onUpload(files: FileList | File[]) {
    if (!selectedFolderId) return;
    const list = Array.from(files);
    if (!list.length) return;
    setBusy(true);
    setError(null);
    setUploadProgress({ current: 0, total: list.length });
    try {
      for (let i = 0; i < list.length; i++) {
        const file = list[i]!;
        setUploadProgress({ current: i + 1, total: list.length });
        const form = new FormData();
        form.set("folderId", selectedFolderId);
        form.set("file", file);
        const res = await fetch("/api/admin/media", {
          method: "POST",
          body: form,
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          throw new Error(data.error || `Upload failed for ${file.name}.`);
        }
      }
      await loadAll();
      toast(
        list.length === 1 ? "Upload complete" : `${list.length} files uploaded`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      setError(message);
      toast(message, "error");
    } finally {
      setBusy(false);
      setUploadProgress(null);
    }
  }

  async function removeMedia(id: string) {
    if (!confirm("Delete this media item?")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/media?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not delete media.");
      await loadAll();
      toast("Media deleted");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not delete media.";
      setError(message);
      toast(message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function setOrderStatus(id: string, status: OrderStatus) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not update order.");
      await loadAll();
      toast(
        status === "archived"
          ? "Order archived"
          : status === "read"
            ? "Marked as read"
            : "Order updated"
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not update order.";
      setError(message);
      toast(message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function copyEmail(email: string) {
    try {
      await navigator.clipboard.writeText(email);
      toast("Email copied");
    } catch {
      toast("Could not copy email", "error");
    }
  }

  function onTabChange(value: string) {
    const next = value === "orders" ? "orders" : "media";
    setTab(next);
    writeStoredTab(next);
  }

  const newOrderCount = orders.filter((o) => o.status === "new").length;

  return (
    <AdminShell
      storage={storage}
      refreshing={refreshing || loading}
      onRefresh={() => void refresh()}
      onLogout={() => void logout()}
    >
      {error ? (
        <div className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {loading || !tabReady ? (
        <div className="mt-24 flex items-center justify-center gap-3 text-obsidian-300">
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
          Opening desk…
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 space-y-8"
        >
          <AdminKpiStrip
            newOrders={newOrderCount}
            totalOrders={orders.length}
            folders={folders.length}
            mediaCount={media.length}
          />

          <Tabs value={tab} onValueChange={onTabChange}>
            <TabsList>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="orders">
                Orders
                {newOrderCount > 0 ? (
                  <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-obsidian-950">
                    {newOrderCount}
                  </span>
                ) : null}
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {tab === "media" ? (
                    <AdminMediaPanel
                      folders={folders}
                      media={media}
                      selectedFolderId={selectedFolderId}
                      onSelectFolder={setSelectedFolderId}
                      busy={busy}
                      uploadsEnabled={Boolean(storage?.uploadsEnabled)}
                      uploadProgress={uploadProgress}
                      onCreateFolder={createFolder}
                      onRemoveFolder={removeFolder}
                      onUpload={onUpload}
                      onRemoveMedia={removeMedia}
                    />
                  ) : (
                    <AdminOrdersPanel
                      orders={orders}
                      busy={busy}
                      onStatusChange={setOrderStatus}
                      onCopyEmail={copyEmail}
                      searchRef={searchRef}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </motion.div>
      )}
    </AdminShell>
  );
}

export function AdminDashboard() {
  return (
    <AdminToastProvider>
      <AdminDashboardInner />
    </AdminToastProvider>
  );
}
