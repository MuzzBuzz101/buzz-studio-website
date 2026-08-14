export function formatBytes(size?: number) {
  if (!size && size !== 0) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatRelativeTime(iso: string) {
  try {
    const date = new Date(iso);
    const diffMs = Date.now() - date.getTime();
    const sec = Math.round(diffMs / 1000);
    if (sec < 60) return "just now";
    const min = Math.round(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.round(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.round(hr / 24);
    if (day < 7) return `${day}d ago`;
    return formatDate(iso);
  } catch {
    return iso;
  }
}

export const TAB_STORAGE_KEY = "buzz-admin-tab";
export type AdminTab = "dashboard" | "orders" | "media";

export function readStoredTab(): AdminTab {
  if (typeof window === "undefined") return "dashboard";
  try {
    const value = sessionStorage.getItem(TAB_STORAGE_KEY);
    if (value === "dashboard" || value === "media" || value === "orders") {
      return value;
    }
  } catch {
    /* ignore */
  }
  return "dashboard";
}

export function writeStoredTab(tab: AdminTab) {
  try {
    sessionStorage.setItem(TAB_STORAGE_KEY, tab);
  } catch {
    /* ignore */
  }
}

export function formatCompact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1000).toFixed(1)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function orderStatusLabel(status: string) {
  switch (status) {
    case "new":
      return "Pending";
    case "read":
      return "In progress";
    case "done":
      return "Done";
    case "archived":
      return "Archived";
    default:
      return status;
  }
}
