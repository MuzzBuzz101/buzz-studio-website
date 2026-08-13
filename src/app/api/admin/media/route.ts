import { NextResponse } from "next/server";
import {
  deleteMedia,
  getStorageInfo,
  listMedia,
  uploadMedia,
} from "@/lib/admin-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get("folderId") || undefined;
    const media = await listMedia(folderId);
    return NextResponse.json({ media, storage: getStorageInfo() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list media.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const folderId = String(form.get("folderId") || "");
    const file = form.get("file");

    if (!folderId) {
      return NextResponse.json({ error: "folderId is required." }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required." }, { status: 400 });
    }

    const media = await uploadMedia({ folderId, file });
    return NextResponse.json({ media }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to upload media.";
    const status = message.includes("BLOB_READ_WRITE_TOKEN") ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Media id is required." }, { status: 400 });
    }
    await deleteMedia(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete media.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
