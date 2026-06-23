export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
};

export type InboxRange = "24h" | "7d" | "15d" | "30d" | "90d" | "all";

export const INBOX_RANGE_OPTIONS: { id: InboxRange; label: string }[] = [
  { id: "24h", label: "24 hours" },
  { id: "7d", label: "7 days" },
  { id: "15d", label: "15 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "all", label: "All time" },
];

const MS_HOUR = 60 * 60 * 1000;
const MS_DAY = 24 * MS_HOUR;

export const getRangeStart = (range: InboxRange): Date | null => {
  const now = Date.now();
  switch (range) {
    case "24h":
      return new Date(now - 24 * MS_HOUR);
    case "7d":
      return new Date(now - 7 * MS_DAY);
    case "15d":
      return new Date(now - 15 * MS_DAY);
    case "30d":
      return new Date(now - 30 * MS_DAY);
    case "90d":
      return new Date(now - 90 * MS_DAY);
    default:
      return null;
  }
};

export const filterMessagesByRange = (messages: ContactMessage[], range: InboxRange): ContactMessage[] => {
  const start = getRangeStart(range);
  if (!start) return messages;
  return messages.filter((m) => m.created_at && new Date(m.created_at) >= start);
};

export type ParsedContactBody = {
  phone: string | null;
  service: string | null;
  description: string | null;
  raw: string;
};

export const parseContactMessageBody = (raw: string): ParsedContactBody => {
  const trimmed = raw.trim();
  const phone = trimmed.match(/(?:^|\|)\s*phone:\s*([^|]+)/i)?.[1]?.trim() || null;
  const service = trimmed.match(/(?:^|\|)\s*service:\s*([^|]+)/i)?.[1]?.trim() || null;
  const description = trimmed.match(/(?:^|\|)\s*description:\s*(.+)$/is)?.[1]?.trim() || null;
  const hasStructured = Boolean(phone || service || description);
  return {
    phone,
    service,
    description: description || (hasStructured ? null : trimmed),
    raw: trimmed,
  };
};

/** Plain-text body for inbox display, reply email, and copy. */
export const formatContactMessagePlain = (
  message: ContactMessage
): { subject: string; lines: { label: string; value: string }[]; body: string } => {
  const parsed = parseContactMessageBody(message.message);
  const lines: { label: string; value: string }[] = [
    { label: "Name", value: message.name },
    { label: "Email", value: message.email },
  ];
  if (parsed.phone) lines.push({ label: "Phone", value: parsed.phone });
  if (parsed.service) lines.push({ label: "Service", value: parsed.service });
  const body = parsed.description || (parsed.phone || parsed.service ? "" : message.message);
  return {
    subject: parsed.service || "Contact form inquiry",
    lines,
    body,
  };
};

const dateTimeFmt = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const utcFmt = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "UTC",
  hour12: false,
});

const relativeFmt = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

const formatRelative = (date: Date): string => {
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
  const abs = Math.abs(diffSec);
  if (abs < 60) return relativeFmt.format(diffSec, "second");
  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return relativeFmt.format(diffMin, "minute");
  const diffHr = Math.round(diffMin / 60);
  if (Math.abs(diffHr) < 24) return relativeFmt.format(diffHr, "hour");
  const diffDay = Math.round(diffHr / 24);
  if (Math.abs(diffDay) < 30) return relativeFmt.format(diffDay, "day");
  const diffMonth = Math.round(diffDay / 30);
  if (Math.abs(diffMonth) < 12) return relativeFmt.format(diffMonth, "month");
  return relativeFmt.format(Math.round(diffMonth / 12), "year");
};

/** Short label for inbox list rows (Gmail-style). */
export const formatMessageListDate = (createdAt: string | undefined): string => {
  if (!createdAt) return "";
  const date = new Date(createdAt);
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startMsg = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (startMsg.getTime() === startToday.getTime()) {
    return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
  }
  const startWeek = new Date(startToday);
  startWeek.setDate(startWeek.getDate() - 7);
  if (date >= startWeek) {
    return new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date);
  }
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
};

export const formatMessageReceivedAt = (createdAt: string | undefined): { absolute: string; relative: string; utc: string } => {
  if (!createdAt) {
    return { absolute: "Unknown date", relative: "", utc: "" };
  }
  const date = new Date(createdAt);
  return {
    absolute: dateTimeFmt.format(date),
    relative: formatRelative(date),
    utc: utcFmt.format(date),
  };
};

export const openReplyEmail = (
  message: ContactMessage,
  options?: { businessName?: string; yourEmail?: string }
) => {
  const parsed = parseContactMessageBody(message.message);
  const received = formatMessageReceivedAt(message.created_at);
  const formatted = formatContactMessagePlain(message);
  const business = options?.businessName ?? "Inference Logix";

  const subject = `Re: ${formatted.subject} — ${business}`;
  const body = [
    `Hi ${message.name},`,
    "",
    `Thank you for reaching out to ${business}.`,
    "",
    "---",
    "Original submission:",
    `Received: ${received.absolute}${received.relative ? ` (${received.relative})` : ""}`,
    ...formatted.lines.map((row) => `${row.label}: ${row.value}`),
    "",
    formatted.body || "(No message body)",
    "",
    "[Your reply here]",
    "",
    "Best regards,",
    options?.yourEmail ?? business,
  ].join("\n");

  const mailto = `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailto, "_blank", "noopener,noreferrer");
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
