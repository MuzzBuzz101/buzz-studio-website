"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FolderPlus,
  ImageIcon,
  Loader2,
  Trash2,
  Upload,
  Video,
  Images,
  Clapperboard,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminFolder, AdminMedia, FolderKind } from "@/lib/admin-types";
import { cn } from "@/lib/utils";
import { formatBytes, formatRelativeTime } from "./admin-utils";

function kindIcon(kind: FolderKind) {
  if (kind === "photos") return <Images className="h-4 w-4" />;
  if (kind === "videos") return <Clapperboard className="h-4 w-4" />;
  return <Layers className="h-4 w-4" />;
}

export function AdminMediaPanel({
  folders,
  media,
  selectedFolderId,
  onSelectFolder,
  busy,
  uploadsEnabled,
  uploadProgress,
  onCreateFolder,
  onRemoveFolder,
  onUpload,
  onRemoveMedia,
}: {
  folders: AdminFolder[];
  media: AdminMedia[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string) => void;
  busy: boolean;
  uploadsEnabled: boolean;
  uploadProgress: { current: number; total: number } | null;
  onCreateFolder: (name: string, kind: FolderKind) => Promise<void>;
  onRemoveFolder: (id: string) => Promise<void>;
  onUpload: (files: FileList | File[]) => Promise<void>;
  onRemoveMedia: (id: string) => Promise<void>;
}) {
  const [folderName, setFolderName] = useState("");
  const [folderKind, setFolderKind] = useState<FolderKind>("mixed");
  const [showCreate, setShowCreate] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of media) {
      map.set(m.folderId, (map.get(m.folderId) || 0) + 1);
    }
    return map;
  }, [media]);

  async function handleCreate() {
    if (!folderName.trim()) return;
    await onCreateFolder(folderName.trim(), folderKind);
    setFolderName("");
    setFolderKind("mixed");
    setShowCreate(false);
  }

  function handleFiles(files: FileList | File[] | null) {
    if (!files || (files instanceof FileList ? !files.length : !files.length)) {
      return;
    }
    void onUpload(files);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] uppercase tracking-widest2 text-obsidian-400">
            Folders
          </p>
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-widest text-obsidian-200 transition-colors hover:border-accent/40 hover:text-accent-soft"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            New
          </button>
        </div>

        {showCreate ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder name"
              className="h-11 w-full rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-white placeholder:text-obsidian-500 focus:outline-none focus:ring-1 focus:ring-accent/40"
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleCreate();
              }}
            />
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {(
                [
                  ["photos", "Photos"],
                  ["videos", "Videos"],
                  ["mixed", "Mixed"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFolderKind(value)}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-[11px] uppercase tracking-widest transition-colors",
                    folderKind === value
                      ? "border-accent/40 bg-accent/15 text-accent-soft"
                      : "border-white/10 text-obsidian-300 hover:border-white/25"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <Button
              type="button"
              size="sm"
              className="mt-3 w-full"
              disabled={busy || !folderName.trim()}
              onClick={() => void handleCreate()}
            >
              <FolderPlus className="h-4 w-4" />
              Create folder
            </Button>
          </motion.div>
        ) : null}

        <div className="space-y-2">
          {folders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/12 px-4 py-8 text-center">
              <p className="font-display text-lg text-white">No folders yet</p>
              <p className="mt-1 text-xs text-obsidian-400">
                Create one to start uploading.
              </p>
            </div>
          ) : (
            folders.map((folder) => {
              const count = counts.get(folder.id) || 0;
              const active = selectedFolderId === folder.id;
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => onSelectFolder(folder.id)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
                    active
                      ? "border-accent/35 bg-accent/10 text-white"
                      : "border-white/10 text-obsidian-200 hover:border-white/20 hover:bg-white/[0.03]"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                      active
                        ? "border-accent/40 bg-accent/15 text-accent"
                        : "border-white/10 bg-white/[0.04] text-obsidian-300"
                    )}
                  >
                    {kindIcon(folder.kind)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {folder.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] uppercase tracking-widest text-obsidian-400">
                      {folder.kind} · {count}
                    </span>
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      void onRemoveFolder(folder.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        void onRemoveFolder(folder.id);
                      }
                    }}
                    className="rounded-md p-1.5 text-obsidian-500 opacity-70 transition-opacity hover:bg-white/10 hover:text-white group-hover:opacity-100"
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
          <div className="flex h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-white/12 bg-white/[0.02] text-center">
            <p className="font-display text-2xl text-white">Select a folder</p>
            <p className="mt-2 text-sm text-obsidian-400">
              Or create one to begin curating the vault.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-white md:text-3xl">
                  {selectedFolder.name}
                </h2>
                <p className="mt-1 text-sm text-obsidian-400">
                  {folderMedia.length} item
                  {folderMedia.length === 1 ? "" : "s"} · {selectedFolder.kind}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busy || !uploadsEnabled}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                multiple
                className="hidden"
                disabled={busy || !uploadsEnabled}
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>

            <div
              onDragEnter={(e) => {
                e.preventDefault();
                if (uploadsEnabled && !busy) setDragging(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (uploadsEnabled && !busy) setDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                if (e.currentTarget === e.target) setDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (!uploadsEnabled || busy) return;
                handleFiles(e.dataTransfer.files);
              }}
              className={cn(
                "mt-6 flex min-h-[140px] flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-8 text-center transition-colors",
                dragging
                  ? "border-accent/50 bg-accent/10"
                  : "border-white/12 bg-white/[0.02]",
                (!uploadsEnabled || busy) && "opacity-60"
              )}
            >
              {uploadProgress ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-accent" />
                  <p className="mt-3 text-sm text-accent-soft">
                    Uploading {uploadProgress.current} of {uploadProgress.total}…
                  </p>
                  <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          (uploadProgress.current / uploadProgress.total) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <Upload
                    className={cn(
                      "h-5 w-5",
                      dragging ? "text-accent" : "text-obsidian-400"
                    )}
                  />
                  <p className="mt-3 text-sm text-obsidian-200">
                    Drag & drop photos or videos here
                  </p>
                  <p className="mt-1 text-xs text-obsidian-500">
                    JPEG, PNG, WebP, GIF, MP4, WebM, MOV · up to 100MB
                  </p>
                </>
              )}
            </div>

            {folderMedia.length === 0 ? (
              <div className="mt-6 flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-center">
                <p className="font-display text-xl text-white">Empty vault</p>
                <p className="mt-1 text-sm text-obsidian-400">
                  Drop files above to fill this folder.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {folderMedia.map((item, i) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(i * 0.04, 0.24),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
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
                        <div className="relative h-full w-full">
                          <video
                            src={item.url}
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                          />
                          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white">
                              <Video className="h-4 w-4" />
                            </span>
                          </span>
                        </div>
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
                          {formatRelativeTime(item.createdAt)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void onRemoveMedia(item.id)}
                        className="rounded-md p-1.5 text-obsidian-400 opacity-70 transition-opacity hover:bg-white/10 hover:text-white group-hover:opacity-100"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
