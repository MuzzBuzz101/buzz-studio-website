import { NextResponse } from "next/server";
import {
  createFolder,
  deleteFolder,
  getStorageInfo,
  listFolders,
} from "@/lib/admin-store";
import type { FolderKind } from "@/lib/admin-types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const folders = await listFolders();
    return NextResponse.json({ folders, storage: getStorageInfo() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list folders.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let body: { name?: string; kind?: FolderKind };
    try {
      body = (await request.json()) as { name?: string; kind?: FolderKind };
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const folder = await createFolder({
      name: typeof body.name === "string" ? body.name : "",
      kind: (body.kind ?? "mixed") as FolderKind,
    });
    return NextResponse.json({ folder }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create folder.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Folder id is required." }, { status: 400 });
    }
    await deleteFolder(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete folder.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
