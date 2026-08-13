import type { AvailabilityStatus } from "@/lib/availability";
import { siteConfig } from "@/data/site";

export type ChatRole = "user" | "assistant" | "system";

export type ChatProviderSource = "groq" | "gemini" | "openai" | "fallback";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export function buildSystemPrompt(status: AvailabilityStatus): string {
  const presence =
    status === "online"
      ? `The studio is currently online in Cyprus hours. You may help as the AI assistant, but note that a human (Syed Muzammil Shah Kazmi) may reply personally. For the fastest personal reply, gently encourage Text (SMS) or WhatsApp.`
      : `The studio is currently away. You are the active AI design concierge — warm, precise, and helpful. Offer thoughtful visual-direction guidance, then suggest Text or WhatsApp so a human can follow up when back.`;

  return `You are the Buzz Studio AI concierge for ${siteConfig.ownerName} at ${siteConfig.fullName} (${siteConfig.location}).

Tone: elegant, cinematic, premium — never salesy spam. Speak like a refined design consultant for cinematography, photography, branding, and visual direction.

Your role:
- Help visitors refine stylish, elegant visual direction for their projects.
- Ask clarifying questions about project type, mood/aesthetic, audience, timeline, and deliverables.
- Never invent exact prices. Only mention vague ballpark ranges if pressed, and steer quotes to a personal conversation.
- Keep replies concise (usually 2–4 short paragraphs or tight bullets).
- Encourage booking via Text SMS (${siteConfig.sms}), WhatsApp, or email (${siteConfig.email}) for quotes and scheduling.

${presence}

Contact shortcuts:
- SMS: ${siteConfig.sms}
- WhatsApp: ${siteConfig.whatsapp}
- Email: ${siteConfig.email}`;
}

const FALLBACK_REPLIES: { match: RegExp; reply: string }[] = [
  {
    match: /price|budget|cost|quote|rate|how much/i,
    reply:
      "Happy to frame scope before numbers — exact fees turn on shoot days, crew, deliverables, and post. Tell me the project type, rough timeline, and what you need delivered (film length, still count, colour grade, etc.), and I’ll outline what to confirm. For a personal quote, Text or WhatsApp is the fastest path.",
  },
  {
    match: /availab|book|schedule|when|calendar|slot|date/i,
    reply:
      "Happy to help you plan timing. What’s the shoot window (ideal date or month), location, and whether you need prep or post days as well? Share that here, then Text or WhatsApp so the studio can lock a slot personally.",
  },
  {
    match: /music|mv|video|film|cinemat|reel|commercial/i,
    reply:
      "For motion we usually start with mood: cool editorial, warm intimate, or high-contrast cinematic. What’s the piece for (music video, brand film, reel), and what feeling should the first frame leave? Any references you love? Once that’s clear, Text or WhatsApp and we can lock creative + schedule.",
  },
  {
    match: /photo|portrait|lookbook|fashion|event|grad|wedding|still/i,
    reply:
      "Strong stills begin with light and intention — soft daylight, controlled studio, or documentary atmosphere. Who’s the subject or brand, where will the images live (campaign, lookbook, social), and what’s the desired mood? Tell me more here, or Text/WhatsApp when you’re ready to book.",
  },
  {
    match: /brand|logo|visual|identity|direction|aesthetic|mood|style|colour|color|grade/i,
    reply:
      "Let’s shape a clear visual north star: palette (muted metals vs warm earth), texture (gloss vs grain), and pace (still luxury vs kinetic). What’s the brand personality, audience, and any references you’re drawn to? I can refine direction here — personal polish happens over Text or WhatsApp.",
  },
  {
    match: /food|restaurant|beverage|menu|real.?estate|property|interior/i,
    reply:
      "For commercial work we lean into appetite appeal or spatial storytelling — detail close-ups, ambient lifestyle, or architectural calm. Is this food & beverage, real estate, or something adjacent, and should the look feel warm inviting or cool premium? Share that, then Text/WhatsApp for a tailored plan.",
  },
  {
    match: /edit|post|davinci|colour|color.?grad|cut|assembly/i,
    reply:
      "Post is where the look locks in — pacing, grade, and polish. Do you already have footage, or is this a full production + edit package? Tell me runtime targets and the mood of the grade (clean commercial vs cinematic contrast). Text or WhatsApp when you want a human to scope it.",
  },
  {
    match: /hello|hi|hey|start|help|good\s*(morning|afternoon|evening)/i,
    reply:
      "Welcome to Buzz Studio. I’m the design concierge — here to help refine elegant visual direction for film, photography, or brand work. What are you creating, and what mood are you after?",
  },
  {
    match: /contact|whatsapp|text|sms|email|reach|call/i,
    reply:
      "Direct line to the studio: Text (SMS), WhatsApp, or email. Share a short brief (project type + mood + timing) there for the fastest personal reply — or keep refining the creative direction with me here first.",
  },
];

const DEFAULT_FALLBACK =
  "I can help refine mood, audience, and deliverables for your project. Share the project type and the feeling you want on screen or in-frame — then Text or WhatsApp for a personal reply and quote from the studio.";

export function getFallbackReply(
  userMessage: string,
  status: AvailabilityStatus
): string {
  const matched = FALLBACK_REPLIES.find((entry) =>
    entry.match.test(userMessage)
  );
  const base = matched?.reply ?? DEFAULT_FALLBACK;

  if (status === "online") {
    return `${base}\n\nStudio is online now — Text or WhatsApp reaches a human fastest.`;
  }

  return `${base}\n\nWe’re away at the moment; I’ll keep guiding visual direction here, and Text/WhatsApp will reach the studio when back.`;
}

function trimConversation(messages: ChatMessage[]) {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
}

async function createOpenAiCompatibleReply(options: {
  apiKey: string;
  endpoint: string;
  model: string;
  messages: ChatMessage[];
  status: AvailabilityStatus;
  label: string;
}): Promise<string | null> {
  const { apiKey, endpoint, model, messages, status, label } = options;
  const system = buildSystemPrompt(status);
  const trimmed = trimConversation(messages);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 450,
      messages: [{ role: "system", content: system }, ...trimmed],
    }),
  });

  if (!response.ok) {
    console.error(
      `${label} chat error`,
      response.status,
      await response.text()
    );
    return null;
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  return content || null;
}

/** Primary free provider — Groq (OpenAI-compatible). */
export async function createGroqReply(
  messages: ChatMessage[],
  status: AvailabilityStatus
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) return null;

  // Production free-tier chat model; override with GROQ_MODEL if needed.
  const model =
    process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";

  return createOpenAiCompatibleReply({
    apiKey,
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    model,
    messages,
    status,
    label: "Groq",
  });
}

/** Optional free fallback — Google Gemini. */
export async function createGeminiReply(
  messages: ChatMessage[],
  status: AvailabilityStatus
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const model =
    process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
  const system = buildSystemPrompt(status);
  const trimmed = trimConversation(messages);

  const contents = trimmed.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 450,
      },
    }),
  });

  if (!response.ok) {
    console.error("Gemini chat error", response.status, await response.text());
    return null;
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const content = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("")
    .trim();

  return content || null;
}

/** Optional last resort if an OpenAI key happens to be present. */
export async function createOpenAIReply(
  messages: ChatMessage[],
  status: AvailabilityStatus
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  return createOpenAiCompatibleReply({
    apiKey,
    endpoint: "https://api.openai.com/v1/chat/completions",
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
    messages,
    status,
    label: "OpenAI",
  });
}

/**
 * Provider priority: Groq (free) → Gemini (free) → OpenAI (optional) → null.
 * Caller should use canned fallback when null.
 */
export async function createAiReply(
  messages: ChatMessage[],
  status: AvailabilityStatus
): Promise<{ reply: string | null; source: Exclude<ChatProviderSource, "fallback"> | null }> {
  const providers: {
    source: Exclude<ChatProviderSource, "fallback">;
    run: () => Promise<string | null>;
  }[] = [
    { source: "groq", run: () => createGroqReply(messages, status) },
    { source: "gemini", run: () => createGeminiReply(messages, status) },
    { source: "openai", run: () => createOpenAIReply(messages, status) },
  ];

  for (const provider of providers) {
    try {
      const reply = await provider.run();
      if (reply) return { reply, source: provider.source };
    } catch (error) {
      console.error(`${provider.source} chat provider failed`, error);
    }
  }

  return { reply: null, source: null };
}
