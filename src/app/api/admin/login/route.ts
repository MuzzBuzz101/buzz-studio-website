import { NextResponse } from "next/server";
import {
  adminCookieOptions,
  createAdminSessionToken,
  getAdminPassword,
  isAdminAuthConfigured,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { error: "Admin auth is not configured. Set ADMIN_PASSWORD and ADMIN_SECRET." },
      { status: 503 }
    );
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  const expected = getAdminPassword();

  if (!expected || password !== expected) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const token = await createAdminSessionToken();
  const cookie = adminCookieOptions();
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    ...cookie,
    value: token,
  });
  return response;
}
