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
      meta: { source: "contact-form" },
    });

    return NextResponse.json({ ok: true, id: order.id }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
