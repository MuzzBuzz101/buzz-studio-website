export type FolderKind = "photos" | "videos" | "mixed";
export type MediaType = "photo" | "video";
export type OrderStatus = "new" | "read" | "archived";

export interface AdminFolder {
  id: string;
  name: string;
  kind: FolderKind;
  createdAt: string;
}

export interface AdminMedia {
  id: string;
  folderId: string;
  type: MediaType;
  url: string;
  name: string;
  size?: number;
  createdAt: string;
  /** Present when stored on Vercel Blob (needed for delete). */
  blobPathname?: string;
}

export interface AdminOrder {
  id: string;
  createdAt: string;
  status: OrderStatus;
  name: string;
  email: string;
  phone?: string;
  inquiryType?: string;
  message?: string;
  videoLength?: string;
  meta?: Record<string, unknown>;
}

export interface AdminStore {
  folders: AdminFolder[];
  media: AdminMedia[];
  orders: AdminOrder[];
}

export const EMPTY_ADMIN_STORE: AdminStore = {
  folders: [],
  media: [],
  orders: [],
};

export const ADMIN_COOKIE_NAME = "buzz_admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // 100MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;
export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;
