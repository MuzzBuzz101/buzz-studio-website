import { promises as fs } from "fs";
import path from "path";
import { del, get, list, put } from "@vercel/blob";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  EMPTY_ADMIN_STORE,
  EMPTY_ANALYTICS,
  MAX_UPLOAD_BYTES,
  ORDER_STATUSES,
  type AdminFolder,
  type AdminMedia,
  type AdminOrder,
  type AdminStore,
  type AnalyticsDailyBucket,
  type AnalyticsStore,
  type FolderKind,
  type MediaType,
  type OrderStatus,
} from "@/lib/admin-types";

const LOCAL_STORE_PATH = path.join(process.cwd(), "data", "admin-store.json");
const BLOB_STORE_PATHNAME = "admin/store.json";

type StoreBackend = "blob" | "local";
type BlobAccess = "public" | "private";

export function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

/** Private Blob stores require access:'private' (default). Set BLOB_ACCESS=public only for public stores. */
export function getBlobAccess(): BlobAccess {
  const value = process.env.BLOB_ACCESS?.trim().toLowerCase();
  return value === "public" ? "public" : "private";
}

function blobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

export function isVercelRuntime(): boolean {
  return process.env.VERCEL === "1";
}

export function getStorageInfo(): {
  backend: StoreBackend;
  uploadsEnabled: boolean;
  banner: string | null;
} {
  if (hasBlobToken()) {
    return {
      backend: "blob",
      uploadsEnabled: true,
      banner:
        getBlobAccess() === "private"
          ? "Blob storage is private — orders and media are saved securely for admin only."
          : null,
    };
  }
  if (isVercelRuntime()) {
    return {
      backend: "local",
      uploadsEnabled: false,
      banner:
        "Vercel Blob is not configured. Orders may not persist across deploys. Set BLOB_READ_WRITE_TOKEN to enable durable storage and media uploads.",
    };
  }
  return {
    backend: "local",
    uploadsEnabled: true,
    banner:
      "Running on local JSON storage (data/admin-store.json). Add BLOB_READ_WRITE_TOKEN on Vercel for production uploads.",
  };
}

function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function normalizeDaily(raw: unknown): AnalyticsDailyBucket[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (row): row is AnalyticsDailyBucket =>
        Boolean(row) &&
        typeof row === "object" &&
        typeof (row as AnalyticsDailyBucket).date === "string"
    )
    .map((row) => ({
      date: row.date,
      visitors: Number(row.visitors) || 0,
      pageViews: Number(row.pageViews) || 0,
      videoViews: Number(row.videoViews) || 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);
}

function normalizeAnalytics(raw: unknown): AnalyticsStore {
  if (!raw || typeof raw !== "object") {
    return {
      ...EMPTY_ANALYTICS,
      videoViews: {},
      visitorIds: [],
      daily: [],
    };
  }
  const data = raw as Partial<AnalyticsStore>;
  const videoViews: Record<string, number> = {};
  if (data.videoViews && typeof data.videoViews === "object") {
    for (const [key, value] of Object.entries(data.videoViews)) {
      const n = Number(value);
      if (key && Number.isFinite(n) && n > 0) videoViews[key] = Math.floor(n);
    }
  }
  const visitorIds = Array.isArray(data.visitorIds)
    ? data.visitorIds.filter((id): id is string => typeof id === "string").slice(-5000)
    : [];
  return {
    visitors: Math.max(0, Math.floor(Number(data.visitors) || 0)),
    pageViews: Math.max(0, Math.floor(Number(data.pageViews) || 0)),
    videoViews,
    visitorIds,
    daily: normalizeDaily(data.daily),
  };
}

function normalizeStore(raw: unknown): AdminStore {
  if (!raw || typeof raw !== "object") {
    return {
      ...EMPTY_ADMIN_STORE,
      folders: [],
      media: [],
      orders: [],
      analytics: {
        ...EMPTY_ANALYTICS,
        videoViews: {},
        visitorIds: [],
        daily: [],
      },
    };
  }
  const data = raw as Partial<AdminStore>;
  return {
    folders: Array.isArray(data.folders) ? data.folders : [],
    media: Array.isArray(data.media) ? data.media : [],
    orders: Array.isArray(data.orders) ? data.orders : [],
    analytics: normalizeAnalytics(data.analytics),
  };
}

function ensureDailyBucket(
  daily: AnalyticsDailyBucket[],
  date: string
): AnalyticsDailyBucket {
  let bucket = daily.find((d) => d.date === date);
  if (!bucket) {
    bucket = { date, visitors: 0, pageViews: 0, videoViews: 0 };
    daily.push(bucket);
    daily.sort((a, b) => a.date.localeCompare(b.date));
    while (daily.length > 30) daily.shift();
  }
  return bucket;
}

async function ensureLocalDir(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function readLocalStore(): Promise<AdminStore> {
  try {
    const text = await fs.readFile(LOCAL_STORE_PATH, "utf8");
    return normalizeStore(JSON.parse(text));
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return normalizeStore(null);
    throw err;
  }
}

async function writeLocalStore(store: AdminStore): Promise<void> {
  await ensureLocalDir(LOCAL_STORE_PATH);
  await fs.writeFile(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

async function streamToText(stream: ReadableStream<Uint8Array>): Promise<string> {
  return new Response(stream).text();
}

async function readBlobStore(): Promise<AdminStore> {
  const access = getBlobAccess();
  const token = blobToken();

  if (access === "private") {
    const result = await get(BLOB_STORE_PATHNAME, {
      access: "private",
      useCache: false,
      token,
    });
    if (!result || result.statusCode !== 200 || !result.stream) {
      return normalizeStore(null);
    }
    try {
      return normalizeStore(JSON.parse(await streamToText(result.stream)));
    } catch {
      return normalizeStore(null);
    }
  }

  const { blobs } = await list({ prefix: BLOB_STORE_PATHNAME, limit: 10, token });
  const match = blobs.find((b) => b.pathname === BLOB_STORE_PATHNAME) ?? blobs[0];
  if (!match) return normalizeStore(null);
  const res = await fetch(match.url, { cache: "no-store" });
  if (!res.ok) return normalizeStore(null);
  return normalizeStore(await res.json());
}

async function writeBlobStore(store: AdminStore): Promise<void> {
  await put(BLOB_STORE_PATHNAME, JSON.stringify(store, null, 2), {
    access: getBlobAccess(),
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token: blobToken(),
  });
}

/** Authenticated proxy URL for private media (admin UI). */
export function adminMediaProxyUrl(pathname: string): string {
  return `/api/admin/file?pathname=${encodeURIComponent(pathname)}`;
}

export async function readStore(): Promise<AdminStore> {
  if (hasBlobToken()) return readBlobStore();
  return readLocalStore();
}

async function writeStore(store: AdminStore): Promise<void> {
  if (hasBlobToken()) {
    await writeBlobStore(store);
    return;
  }
  await writeLocalStore(store);
}

async function updateStore(
  mutator: (store: AdminStore) => AdminStore | Promise<AdminStore>
): Promise<AdminStore> {
  const current = await readStore();
  const next = await mutator({
    folders: [...current.folders],
    media: [...current.media],
    orders: [...current.orders],
    analytics: {
      ...current.analytics,
      videoViews: { ...current.analytics.videoViews },
      visitorIds: [...(current.analytics.visitorIds || [])],
      daily: current.analytics.daily.map((d) => ({ ...d })),
    },
  });
  await writeStore(next);
  return next;
}

export async function listFolders(): Promise<AdminFolder[]> {
  const store = await readStore();
  return [...store.folders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createFolder(input: {
  name: string;
  kind: FolderKind;
}): Promise<AdminFolder> {
  const name = input.name.trim();
  if (!name) throw new Error("Folder name is required.");
  if (!["photos", "videos", "mixed"].includes(input.kind)) {
    throw new Error("Invalid folder kind.");
  }

  const folder: AdminFolder = {
    id: createId("fld"),
    name,
    kind: input.kind,
    createdAt: new Date().toISOString(),
  };

  await updateStore((store) => {
    store.folders.push(folder);
    return store;
  });

  return folder;
}

export async function deleteFolder(folderId: string): Promise<void> {
  const store = await readStore();
  const mediaInFolder = store.media.filter((m) => m.folderId === folderId);

  for (const item of mediaInFolder) {
    await removeMediaFile(item);
  }

  await updateStore((s) => {
    s.folders = s.folders.filter((f) => f.id !== folderId);
    s.media = s.media.filter((m) => m.folderId !== folderId);
    return s;
  });
}

function detectMediaType(mime: string): MediaType | null {
  if ((ALLOWED_IMAGE_TYPES as readonly string[]).includes(mime)) return "photo";
  if ((ALLOWED_VIDEO_TYPES as readonly string[]).includes(mime)) return "video";
  return null;
}

async function removeMediaFile(item: AdminMedia): Promise<void> {
  if (item.blobPathname && hasBlobToken()) {
    try {
      await del(item.blobPathname, { token: blobToken() });
    } catch {
      try {
        await del(item.url, { token: blobToken() });
      } catch {
        // Best-effort cleanup
      }
    }
    return;
  }

  if (item.url.startsWith("/uploads/admin/")) {
    const filePath = path.join(process.cwd(), "public", item.url);
    try {
      await fs.unlink(filePath);
    } catch {
      // Best-effort cleanup
    }
  }
}

export async function listMedia(folderId?: string): Promise<AdminMedia[]> {
  const store = await readStore();
  const items = folderId
    ? store.media.filter((m) => m.folderId === folderId)
    : store.media;
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function uploadMedia(input: {
  folderId: string;
  file: File;
}): Promise<AdminMedia> {
  const info = getStorageInfo();
  if (!info.uploadsEnabled) {
    throw new Error(
      "Media uploads require BLOB_READ_WRITE_TOKEN on Vercel. Configure Vercel Blob storage first."
    );
  }

  const store = await readStore();
  const folder = store.folders.find((f) => f.id === input.folderId);
  if (!folder) throw new Error("Folder not found.");

  const mime = input.file.type || "application/octet-stream";
  const type = detectMediaType(mime);
  if (!type) {
    throw new Error(
      "Unsupported file type. Use JPEG, PNG, WebP, GIF, MP4, WebM, or QuickTime."
    );
  }

  if (input.file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File exceeds the 100MB size limit.");
  }

  if (folder.kind === "photos" && type !== "photo") {
    throw new Error("This folder only accepts photos.");
  }
  if (folder.kind === "videos" && type !== "video") {
    throw new Error("This folder only accepts videos.");
  }

  const safeName = input.file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  const id = createId("med");
  let url: string;
  let blobPathname: string | undefined;

  if (hasBlobToken()) {
    const pathname = `admin/media/${folder.id}/${id}-${safeName}`;
    const access = getBlobAccess();
    const blob = await put(pathname, input.file, {
      access,
      addRandomSuffix: false,
      contentType: mime,
      token: blobToken(),
    });
    blobPathname = blob.pathname;
    // Private blobs are not publicly fetchable — serve via admin proxy.
    url =
      access === "private"
        ? adminMediaProxyUrl(blob.pathname)
        : blob.url;
  } else {
    const relDir = path.join("uploads", "admin", folder.id);
    const absDir = path.join(process.cwd(), "public", relDir);
    await fs.mkdir(absDir, { recursive: true });
    const filename = `${id}-${safeName}`;
    const absPath = path.join(absDir, filename);
    const buffer = Buffer.from(await input.file.arrayBuffer());
    await fs.writeFile(absPath, buffer);
    url = `/${relDir.replace(/\\/g, "/")}/${filename}`;
  }

  const media: AdminMedia = {
    id,
    folderId: folder.id,
    type,
    url,
    name: input.file.name,
    size: input.file.size,
    createdAt: new Date().toISOString(),
    blobPathname,
  };

  await updateStore((s) => {
    s.media.push(media);
    return s;
  });

  return media;
}

export async function deleteMedia(mediaId: string): Promise<void> {
  const store = await readStore();
  const item = store.media.find((m) => m.id === mediaId);
  if (!item) throw new Error("Media not found.");
  await removeMediaFile(item);
  await updateStore((s) => {
    s.media = s.media.filter((m) => m.id !== mediaId);
    return s;
  });
}

export async function listOrders(): Promise<AdminOrder[]> {
  const store = await readStore();
  return [...store.orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createOrder(input: {
  name: string;
  email: string;
  phone?: string;
  inquiryType?: string;
  message?: string;
  videoLength?: string;
  meta?: Record<string, unknown>;
}): Promise<AdminOrder> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (!name) throw new Error("Name is required.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("A valid email is required.");
  }

  const order: AdminOrder = {
    id: createId("ord"),
    createdAt: new Date().toISOString(),
    status: "new",
    name,
    email,
    phone: input.phone?.trim() || undefined,
    inquiryType: input.inquiryType?.trim() || undefined,
    message: input.message?.trim()?.slice(0, 5000) || undefined,
    videoLength: input.videoLength?.trim() || undefined,
    meta: input.meta,
  };

  await updateStore((store) => {
    store.orders.unshift(order);
    return store;
  });

  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<AdminOrder> {
  if (!ORDER_STATUSES.includes(status)) {
    throw new Error("Invalid status.");
  }

  let updated: AdminOrder | null = null;
  await updateStore((store) => {
    const idx = store.orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error("Order not found.");
    const next = { ...store.orders[idx]!, status };
    store.orders[idx] = next;
    updated = next;
    return store;
  });

  if (!updated) throw new Error("Order not found.");
  return updated;
}

export type AnalyticsEventType = "pageview" | "visit" | "video_view";

export async function recordAnalyticsEvent(input: {
  type: AnalyticsEventType;
  visitorId: string;
  path?: string;
  videoId?: string;
  slug?: string;
}): Promise<{ visitorId: string; isNewVisitor: boolean }> {
  const visitorId =
    input.visitorId.trim().slice(0, 64) || createId("vid");
  let isNewVisitor = false;

  await updateStore((store) => {
    const analytics = store.analytics;
    const ids = analytics.visitorIds || [];
    const known = ids.includes(visitorId);
    if (!known) {
      isNewVisitor = true;
      ids.push(visitorId);
      if (ids.length > 5000) ids.splice(0, ids.length - 5000);
      analytics.visitorIds = ids;
      analytics.visitors += 1;
    }

    const day = ensureDailyBucket(analytics.daily, todayKey());

    if (input.type === "visit") {
      if (isNewVisitor) day.visitors += 1;
      return store;
    }

    if (input.type === "pageview") {
      analytics.pageViews += 1;
      day.pageViews += 1;
      if (isNewVisitor) day.visitors += 1;
      return store;
    }

    // video_view
    const key =
      (input.slug || input.videoId || input.path || "unknown")
        .trim()
        .slice(0, 120) || "unknown";
    analytics.videoViews[key] = (analytics.videoViews[key] || 0) + 1;
    day.videoViews += 1;
    if (isNewVisitor) day.visitors += 1;
    return store;
  });

  return { visitorId, isNewVisitor };
}

export type AnalyticsSummary = {
  visitors: number;
  pageViews: number;
  videoViewsTotal: number;
  videoViews: { id: string; views: number }[];
  daily: AnalyticsDailyBucket[];
  orders: {
    pending: number;
    inProgress: number;
    done: number;
    archived: number;
    total: number;
  };
};

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const store = await readStore();
  const analytics = store.analytics;
  const videoViews = Object.entries(analytics.videoViews)
    .map(([id, views]) => ({ id, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 20);

  const videoViewsTotal = Object.values(analytics.videoViews).reduce(
    (sum, n) => sum + n,
    0
  );

  const orders = {
    pending: store.orders.filter((o) => o.status === "new").length,
    inProgress: store.orders.filter((o) => o.status === "read").length,
    done: store.orders.filter((o) => o.status === "done").length,
    archived: store.orders.filter((o) => o.status === "archived").length,
    total: store.orders.length,
  };

  // Fill last 30 days for charts (zeros for missing days)
  const dailyMap = new Map(analytics.daily.map((d) => [d.date, d]));
  const filled: AnalyticsDailyBucket[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const key = todayKey(d);
    filled.push(
      dailyMap.get(key) || { date: key, visitors: 0, pageViews: 0, videoViews: 0 }
    );
  }

  return {
    visitors: analytics.visitors,
    pageViews: analytics.pageViews,
    videoViewsTotal,
    videoViews,
    daily: filled,
    orders,
  };
}
