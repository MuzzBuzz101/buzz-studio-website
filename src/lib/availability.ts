export type AvailabilityStatus = "online" | "away";

export type AvailabilityMode = "online" | "away" | "auto";

const TIMEZONE = "Europe/Nicosia";
const OPEN_HOUR = 10;
const CLOSE_HOUR = 20;

function parseMode(raw: string | undefined): AvailabilityMode | null {
  if (!raw) return null;
  const value = raw.trim().toLowerCase();
  if (value === "online" || value === "true" || value === "1") return "online";
  if (value === "away" || value === "false" || value === "0") return "away";
  if (value === "auto") return "auto";
  return null;
}

/** Resolve env override: AVAILABILITY_MODE wins, then STUDIO_AVAILABLE. */
export function getAvailabilityMode(): AvailabilityMode {
  const fromMode = parseMode(process.env.AVAILABILITY_MODE);
  if (fromMode) return fromMode;

  const fromStudio = parseMode(process.env.STUDIO_AVAILABLE);
  if (fromStudio) return fromStudio;

  return "auto";
}

/** Whether local Cyprus time falls within default studio hours (10:00–20:00). */
export function isWithinStudioHours(date = new Date()): boolean {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "numeric",
    hour12: false,
  }).formatToParts(date);

  const hourPart = parts.find((part) => part.type === "hour");
  const hour = hourPart ? Number(hourPart.value) : NaN;
  if (Number.isNaN(hour)) return false;

  // Treat 20:00 as closed (hours are [OPEN_HOUR, CLOSE_HOUR)).
  return hour >= OPEN_HOUR && hour < CLOSE_HOUR;
}

export function getAvailabilityStatus(date = new Date()): AvailabilityStatus {
  const mode = getAvailabilityMode();
  if (mode === "online") return "online";
  if (mode === "away") return "away";
  return isWithinStudioHours(date) ? "online" : "away";
}

export function getAvailabilityPayload(date = new Date()) {
  const status = getAvailabilityStatus(date);
  return {
    status,
    mode: getAvailabilityMode(),
    timezone: TIMEZONE,
    hours: { open: OPEN_HOUR, close: CLOSE_HOUR },
    label:
      status === "online"
        ? "Studio online"
        : "Away — AI concierge active",
  };
}
