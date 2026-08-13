import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
} from "@/lib/admin-types";

const encoder = new TextEncoder();

/** Runtime-safe env read (avoids build-time inlining of undefined). */
function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function getSecret(): string {
  const secret = readEnv("ADMIN_SECRET");
  if (!secret) {
    throw new Error("ADMIN_SECRET is not configured.");
  }
  return secret;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < arr.length; i++) {
    binary += String.fromCharCode(arr[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function hmacSign(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return toBase64Url(signature);
}

async function hmacVerify(
  message: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const expected = await hmacSign(message, secret);
  if (expected.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}

export function getAdminPassword(): string | null {
  return readEnv("ADMIN_PASSWORD") ?? null;
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(readEnv("ADMIN_PASSWORD") && readEnv("ADMIN_SECRET"));
}

export async function createAdminSessionToken(
  ttlSeconds = ADMIN_SESSION_TTL_SECONDS
): Promise<string> {
  const secret = getSecret();
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = toBase64Url(encoder.encode(JSON.stringify({ exp })));
  const sig = await hmacSign(payload, secret);
  return `${payload}.${sig}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  try {
    const secret = getSecret();
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return false;
    const valid = await hmacVerify(payload, sig, secret);
    if (!valid) return false;
    const json = new TextDecoder().decode(fromBase64Url(payload));
    const data = JSON.parse(json) as { exp?: number };
    if (typeof data.exp !== "number") return false;
    return data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function adminCookieOptions(maxAge = ADMIN_SESSION_TTL_SECONDS) {
  return {
    name: ADMIN_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export { ADMIN_COOKIE_NAME };
