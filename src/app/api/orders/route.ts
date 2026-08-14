import { NextResponse } from "next/server";
import { createOrder } from "@/lib/admin-store";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

interface OrderBody {
  name?: string;
  email?: string;
  phone?: string;
  inquiryType?: string;
  projectType?: string;
  message?: string;
  videoLength?: string;
  duration?: string | number;
  meta?: Record<string, unknown>;
}

function sanitizeMeta(
  input: Record<string, unknown> | undefined
): Record<string, unknown> | undefined {
  if (!input || typeof input !== "object" || Array.isArray(input)) return undefined;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (key.length > 64) continue;
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
    ) {
      out[key] =
        typeof value === "string" ? value.trim().slice(0, 2000) : value;
    }
  }
  return Object.keys(out).length ? out : undefined;
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!rateLimit(`orders:${ip}`, 8, 60_000)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  let body: OrderBody;
  try {
    body = (await request.json()) as OrderBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const videoLength =
      typeof body.videoLength === "string"
        ? body.videoLength
        : body.duration != null
          ? String(body.duration)
          : undefined;

    const clientMeta = sanitizeMeta(body.meta);
    const source =
      typeof clientMeta?.source === "string"
        ? clientMeta.source
        : "contact-form";

    const order = await createOrder({
      name: typeof body.name === "string" ? body.name : "",
      email: typeof body.email === "string" ? body.email : "",
      phone: typeof body.phone === "string" ? body.phone : undefined,
      inquiryType:
        typeof body.inquiryType === "string"
          ? body.inquiryType
          : typeof body.projectType === "string"
            ? body.projectType
            : undefined,
      message: typeof body.message === "string" ? body.message : undefined,
      videoLength,
      meta: { ...clientMeta, source },
    });

    return NextResponse.json({ ok: true, id: order.id }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
