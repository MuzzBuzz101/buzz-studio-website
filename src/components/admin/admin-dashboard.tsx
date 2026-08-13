"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  FolderPlus,
  ImageIcon,
  Loader2,
  LogOut,
  Mail,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  AdminFolder,
  AdminMedia,
  AdminOrder,
  FolderKind,
  OrderStatus,
} from "@/lib/admin-types";
import { cn } from "@/lib/utils";

type StorageInfo = {
  backend: "blob" | "local";
  uploadsEnabled: boolean;
  banner: string | null;
};

function formatBytes(size?: number) {
  if (!size && size !== 0) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("media");
  const [folders, setFolders] = useState<AdminFolder[]>([]);
  const [media, setMedia] = useState<AdminMedia[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [folderName, setFolderName] = useState("");
  const [folderKind, setFolderKind] = useState<FolderKind>("mixed");

  const selectedFolder = useMemo(
    () => folders.find((f) => f.id === selectedFolderId) ?? null,
    [folders, selectedFolderId]
  );

  const folderMedia = useMemo(
    () =>
      selectedFolderId
        ? media.filter((m) => m.folderId === selectedFolderId)
        : [],
    [media, selectedFolderId]
  );

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  );

  const loadAll = useCallback(async () => {
    setError(null);
    const [foldersRes, mediaRes, ordersRes] = await Promise.all([
      fetch("/api/admin/folders"),
      fetch("/api/admin/media"),
      fetch("/api/admin/orders"),
    ]);

    if (foldersRes.status === 401 || mediaRes.status === 401 || ordersRes.status === 401) {
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

    if (!foldersRes.ok) throw new Error(foldersData.error || "Failed to load folders.");
    if (!mediaRes.ok) throw new Error(mediaData.error || "Failed to load media.");
    if (!ordersRes.ok) throw new Error(ordersData.error || "Failed to load orders.");

    setFolders(foldersData.folders || []);
    setMedia(mediaData.media || []);
    setOrders(ordersData.orders || []);
    setStorage(foldersData.storage || mediaData.storage || null);
    setSelectedFolderId((prev) => {
      if (prev && (foldersData.folders || []).some((f) => f.id === prev)) return prev;
      return foldersData.folders?.[0]?.id ?? null;
    });
    setSelectedOrderId((prev) => {
      if (prev && (ordersData.orders || []).some((o) => o.id === prev)) return prev;
      return ordersData.orders?.[0]?.id ?? null;
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
          setError(err instanceof Error ? err.message : "Failed to load admin data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadAll]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function createFolder() {
    if (!folderName.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: folderName, kind: folderKind }),
      });
      const data = (await res.json()) as { folder?: AdminFolder; error?: string };
      if (!res.ok) throw new Error(data.error || "Could not create folder.");
      setFolderName("");
      await loadAll();
      if (data.folder) setSelectedFolderId(data.folder.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create folder.");
    } finally {
      setBusy(false);
    }
  }

  async function removeFolder(id: string) {
    if (!confirm("Delete this folder and all media inside it?")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/folders?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not delete folder.");
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete folder.");
    } finally {
      setBusy(false);
    }
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length || !selectedFolderId) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.set("folderId", selectedFolderId);
        form.set("file", file);
        const res = await fetch("/api/admin/media", { method: "POST", body: form });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(data.error || `Upload failed for ${file.name}.`);
      }
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function removeMedia(id: string) {
    if (!confirm("Delete this media item?")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/media?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not delete media.");
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete media.");
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update order.");
    } finally {
      setBusy(false);
    }
  }

  const newOrderCount = orders.filter((o) => o.status === "new").length;

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-5 py-8 md:px-8 md:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-8">
        <div>
          <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
            Buzz Studio
          </p>
          <h1 className="mt-3 font-display text-4xl text-white md:text-5xl">
            Studio desk
          </h1>
          <p className="mt-2 max-w-xl text-sm text-obsidian-300">
            Manage photo/video folders and review client inquiries.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={logout} className="rounded-full">
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </header>

      {storage?.banner ? (
        <div className="mt-6 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-soft">
          {storage.banner}
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-20 flex items-center justify-center gap-3 text-obsidian-300">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading desk…
        </div>
      ) : (
        <Tabs value={tab} onValueChange={setTab} className="mt-10">
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

          <TabsContent value="media" className="mt-8">
            <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
              <aside className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
                    New folder
                  </p>
                  <input
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="Folder name"
                    className="mt-3 h-11 w-full rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-white placeholder:text-obsidian-500 focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                  <select
                    value={folderKind}
                    onChange={(e) => setFolderKind(e.target.value as FolderKind)}
                    className="mt-3 h-11 w-full rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/40"
                  >
                    <option value="mixed">Mixed</option>
                    <option value="photos">Photos</option>
                    <option value="videos">Videos</option>
                  </select>
                  <Button
                    type="button"
                    size="sm"
                    className="mt-3 w-full rounded-full"
                    disabled={busy || !folderName.trim()}
                    onClick={createFolder}
                  >
                    <FolderPlus className="h-4 w-4" />
                    Create
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
                    Folders
                  </p>
                  {folders.length === 0 ? (
                    <p className="text-sm text-obsidian-400">No folders yet.</p>
                  ) : (
                    folders.map((folder) => {
                      const count = media.filter((m) => m.folderId === folder.id).length;
                      return (
                        <button
                          key={folder.id}
                          type="button"
                          onClick={() => setSelectedFolderId(folder.id)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition-colors",
                            selectedFolderId === folder.id
                              ? "border-white/30 bg-white/10 text-white"
                              : "border-white/10 bg-transparent text-obsidian-200 hover:border-white/20 hover:bg-white/[0.03]"
                          )}
                        >
                          <span>
                            <span className="block text-sm font-medium">{folder.name}</span>
                            <span className="mt-0.5 block text-[11px] uppercase tracking-widest text-obsidian-400">
                              {folder.kind} · {count}
                            </span>
                          </span>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              void removeFolder(folder.id);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                e.stopPropagation();
                                void removeFolder(folder.id);
                              }
                            }}
                            className="rounded-md p-1.5 text-obsidian-400 hover:bg-white/10 hover:text-white"
                            aria-label={`Delete ${folder.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </aside>

              <section className="min-w-0">
                {!selectedFolder ? (
                  <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/15 text-sm text-obsidian-400">
                    Create a folder to start uploading.
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h2 className="font-display text-2xl text-white">
                          {selectedFolder.name}
                        </h2>
                        <p className="mt-1 text-sm text-obsidian-400">
                          {folderMedia.length} item{folderMedia.length === 1 ? "" : "s"} ·{" "}
                          {selectedFolder.kind}
                        </p>
                      </div>
                      <label
                        className={cn(
                          "inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm transition-colors hover:border-white/60 hover:bg-white/5",
                          (busy || !storage?.uploadsEnabled) &&
                            "pointer-events-none opacity-50"
                        )}
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                          multiple
                          className="hidden"
                          disabled={busy || !storage?.uploadsEnabled}
                          onChange={(e) => {
                            void onUpload(e.target.files);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>

                    {folderMedia.length === 0 ? (
                      <div className="mt-8 flex h-56 items-center justify-center rounded-2xl border border-dashed border-white/15 text-sm text-obsidian-400">
                        No media in this folder yet.
                      </div>
                    ) : (
                      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {folderMedia.map((item) => (
                          <article
                            key={item.id}
                            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
                          >
                            <div className="relative aspect-video bg-black/50">
                              {item.type === "photo" ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.url}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <video
                                  src={item.url}
                                  className="h-full w-full object-cover"
                                  muted
                                  playsInline
                                  preload="metadata"
                                />
                              )}
                              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[10px] uppercase tracking-widest text-white">
                                {item.type === "photo" ? (
                                  <ImageIcon className="h-3 w-3" />
                                ) : (
                                  <Video className="h-3 w-3" />
                                )}
                                {item.type}
                              </span>
                            </div>
                            <div className="flex items-start justify-between gap-3 p-4">
                              <div className="min-w-0">
                                <p className="truncate text-sm text-white">{item.name}</p>
                                <p className="mt-1 text-xs text-obsidian-400">
                                  {formatBytes(item.size)}
                                  {item.size ? " · " : ""}
                                  {formatDate(item.createdAt)}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => void removeMedia(item.id)}
                                className="rounded-md p-1.5 text-obsidian-400 hover:bg-white/10 hover:text-white"
                                aria-label={`Delete ${item.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </section>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-8">
            <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
              <aside className="space-y-2">
                {orders.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/15 px-4 py-10 text-center text-sm text-obsidian-400">
                    No orders yet. Contact form submissions will appear here.
                  </div>
                ) : (
                  orders.map((order) => (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => setSelectedOrderId(order.id)}
                      className={cn(
                        "w-full rounded-xl border px-4 py-3 text-left transition-colors",
                        selectedOrderId === order.id
                          ? "border-white/30 bg-white/10"
                          : "border-white/10 hover:border-white/20 hover:bg-white/[0.03]"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-medium text-white">
                          {order.name}
                        </p>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest",
                            order.status === "new" && "bg-accent/20 text-accent-soft",
                            order.status === "read" && "bg-white/10 text-obsidian-200",
                            order.status === "archived" && "bg-white/5 text-obsidian-400"
                          )}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs text-obsidian-400">
                        {order.inquiryType || "General"} · {formatDate(order.createdAt)}
                      </p>
                    </button>
                  ))
                )}
              </aside>

              <section>
                {!selectedOrder ? (
                  <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/15 text-sm text-obsidian-400">
                    Select an order to view details.
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
                          Inquiry
                        </p>
                        <h2 className="mt-2 font-display text-3xl text-white">
                          {selectedOrder.name}
                        </h2>
                        <p className="mt-2 text-sm text-obsidian-300">
                          {formatDate(selectedOrder.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedOrder.status !== "read" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={() => void setOrderStatus(selectedOrder.id, "read")}
                          >
                            <Mail className="h-4 w-4" />
                            Mark read
                          </Button>
                        ) : null}
                        {selectedOrder.status !== "archived" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={() =>
                              void setOrderStatus(selectedOrder.id, "archived")
                            }
                          >
                            <Archive className="h-4 w-4" />
                            Archive
                          </Button>
                        ) : null}
                        {selectedOrder.status === "archived" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={() => void setOrderStatus(selectedOrder.id, "read")}
                          >
                            Restore
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs uppercase tracking-widest2 text-obsidian-400">
                          Email
                        </dt>
                        <dd className="mt-2 text-sm text-white">
                          <a
                            href={`mailto:${selectedOrder.email}`}
                            className="underline-offset-4 hover:underline"
                          >
                            {selectedOrder.email}
                          </a>
                        </dd>
                      </div>
                      {selectedOrder.phone ? (
                        <div>
                          <dt className="text-xs uppercase tracking-widest2 text-obsidian-400">
                            Phone
                          </dt>
                          <dd className="mt-2 text-sm text-white">{selectedOrder.phone}</dd>
                        </div>
                      ) : null}
                      <div>
                        <dt className="text-xs uppercase tracking-widest2 text-obsidian-400">
                          Project type
                        </dt>
                        <dd className="mt-2 text-sm text-white">
                          {selectedOrder.inquiryType || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-widest2 text-obsidian-400">
                          Video length
                        </dt>
                        <dd className="mt-2 text-sm text-white">
                          {selectedOrder.videoLength
                            ? `${selectedOrder.videoLength} min`
                            : "—"}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-8">
                      <p className="text-xs uppercase tracking-widest2 text-obsidian-400">
                        Message
                      </p>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-obsidian-100">
                        {selectedOrder.message || "—"}
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
