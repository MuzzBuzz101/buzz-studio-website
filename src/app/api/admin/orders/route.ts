import { NextResponse } from "next/server";
import { listOrders, updateOrderStatus } from "@/lib/admin-store";
import type { OrderStatus } from "@/lib/admin-types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await listOrders();
    return NextResponse.json({ orders });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list orders.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    let body: { id?: string; status?: OrderStatus };
    try {
      body = (await request.json()) as { id?: string; status?: OrderStatus };
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    if (!body.id || !body.status) {
      return NextResponse.json(
        { error: "id and status are required." },
        { status: 400 }
      );
    }

    const order = await updateOrderStatus(body.id, body.status);
    return NextResponse.json({ order });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
