import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, adminCookieOptions } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    ...adminCookieOptions(0),
    name: ADMIN_COOKIE_NAME,
    value: "",
    maxAge: 0,
  });
  return response;
}
