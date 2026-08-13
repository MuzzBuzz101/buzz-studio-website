import { NextResponse } from "next/server";
import { getAvailabilityPayload } from "@/lib/availability";
import {
  createAiReply,
  getFallbackReply,
  type ChatMessage,
  type ChatProviderSource,
} from "@/lib/chat";

export const dynamic = "force-dynamic";

interface ChatRequestBody {
  messages?: ChatMessage[];
}

export async function POST(request: Request) {
  let body: ChatRequestBody;

  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const sanitized = messages
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, 4000),
    }));

  if (sanitized.length === 0) {
    return NextResponse.json(
      { error: "At least one message is required." },
      { status: 400 }
    );
  }

  const availability = getAvailabilityPayload();
  const lastUser = [...sanitized].reverse().find((m) => m.role === "user");

  let reply: string | null = null;
  let source: ChatProviderSource = "fallback";

  const ai = await createAiReply(sanitized, availability.status);
  if (ai.reply && ai.source) {
    reply = ai.reply;
    source = ai.source;
  }

  if (!reply) {
    reply = getFallbackReply(lastUser?.content ?? "", availability.status);
    source = "fallback";
  }

  return NextResponse.json({
    message: { role: "assistant" as const, content: reply },
    availability,
    source,
  });
}
