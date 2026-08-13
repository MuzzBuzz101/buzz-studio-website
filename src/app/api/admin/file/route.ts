import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { getBlobAccess, hasBlobToken } from "@/lib/admin-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!hasBlobToken()) {
    return NextResponse.json({ error: "Blob storage is not configured." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const pathname = searchParams.get("pathname")?.trim();
  if (!pathname || pathname.includes("..")) {
    return NextResponse.json({ error: "Missing or invalid pathname." }, { status: 400 });
  }

  // Only allow admin-uploaded paths
  if (!pathname.startsWith("admin/")) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const access = getBlobAccess();
  const result = await get(pathname, {
    access,
    token: process.env.BLOB_READ_WRITE_TOKEN,
    useCache: true,
  });

  if (!result || result.statusCode !== 200 || !result.stream) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
