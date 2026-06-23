import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronDown,
  Copy,
  Inbox,
  Mail,
  MessageSquareText,
  RefreshCw,
  Reply,
  Trash2,
} from "lucide-react";
import { adminSelect } from "@/components/admin/adminUi";
import { isMessageRead, markMessageAsRead, subscribeInboxRead } from "@/lib/inboxRead";
import {
  type ContactMessage,
  type InboxRange,
  INBOX_RANGE_OPTIONS,
  filterMessagesByRange,
  formatContactMessagePlain,
  formatMessageReceivedAt,
  formatMessageListDate,
  parseContactMessageBody,
  openReplyEmail,
  copyToClipboard,
} from "@/lib/contactInbox";

type Props = {
  messages: ContactMessage[];
  onDelete: (id: string) => Promise<boolean>;
  onRefresh: () => void;
  onMessageRead?: () => void;
  replyFromEmail?: string;
};

const AdminInboxPage = ({ messages, onDelete, onRefresh, onMessageRead, replyFromEmail }: Props) => {
  const [range, setRange] = useState<InboxRange>("30d");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);
  const [, setReadTick] = useState(0);

  useEffect(() => subscribeInboxRead(() => setReadTick((n) => n + 1)), []);

  const filtered = useMemo(() => filterMessagesByRange(messages, range), [messages, range]);

  const rangeCounts = useMemo(
    () =>
      Object.fromEntries(
        INBOX_RANGE_OPTIONS.map((opt) => [opt.id, filterMessagesByRange(messages, opt.id).length])
      ) as Record<InboxRange, number>,
    [messages]
  );

  const selected = useMemo(
    () => filtered.find((m) => m.id === selectedId) ?? null,
    [filtered, selectedId]
  );

  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedId(null);
      setMobileShowDetail(false);
      return;
    }
    const stillVisible = filtered.some((m) => m.id === selectedId);
    if (!stillVisible) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const markSeen = (id: string) => {
    markMessageAsRead(id);
    onMessageRead?.();
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMobileShowDetail(true);
    markSeen(id);
  };

  useEffect(() => {
    if (selectedId) markSeen(selectedId);
  }, [selectedId]);

  const handleCopyMessage = async (message: ContactMessage) => {
    const formatted = formatContactMessagePlain(message);
    const received = formatMessageReceivedAt(message.created_at);
    const text = [
      `Received: ${received.absolute}`,
      ...formatted.lines.map((row) => `${row.label}: ${row.value}`),
      "",
      formatted.body,
    ].join("\n");
    if (await copyToClipboard(text)) toast.success("Message copied");
    else toast.error("Could not copy");
  };

  const renderReadingPane = (message: ContactMessage) => {
    const formatted = formatContactMessagePlain(message);
    const received = formatMessageReceivedAt(message.created_at);

    return (
      <>
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/30 px-4 py-3 md:px-6 bg-muted/5">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold truncate">{formatted.subject}</h3>
            <p className="text-sm text-foreground/90 mt-0.5">{message.name}</p>
            <a href={`mailto:${message.email}`} className="text-sm text-primary hover:underline break-all">
              {message.email}
            </a>
            <p className="text-xs text-muted-foreground mt-1">
              {received.absolute}
              {received.relative ? ` · ${received.relative}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button size="sm" className="rounded-full h-8" onClick={() => openReplyEmail(message, { yourEmail: replyFromEmail })}>
              <Reply className="w-3.5 h-3.5 mr-1.5" />
              Reply
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full h-8"
              onClick={() => void copyToClipboard(message.email).then((ok) => (ok ? toast.success("Email copied") : toast.error("Could not copy")))}
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copy
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full h-8 text-destructive hover:text-destructive"
              onClick={async () => {
                if (!(await onDelete(message.id))) return;
                setMobileShowDetail(false);
              }}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete
            </Button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4 overflow-y-auto flex-1">
          <dl className="grid gap-2 sm:grid-cols-2 rounded-lg border border-border/30 bg-muted/10 p-4">
            {formatted.lines.map((row) => (
              <div key={row.label}>
                <dt className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{row.label}</dt>
                <dd className="text-sm text-foreground mt-0.5 break-words">{row.value}</dd>
              </div>
            ))}
          </dl>
          {received.utc ? (
            <p className="text-[11px] font-mono text-muted-foreground">Received (UTC): {received.utc}</p>
          ) : null}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Message</p>
            <div className="rounded-lg border border-border/30 bg-background/40 p-4 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
              {formatted.body || "—"}
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => void handleCopyMessage(message)}>
            <Copy className="w-3.5 h-3.5 mr-1.5" />
            Copy full message
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="rounded-2xl border border-border/40 bg-card/30 overflow-hidden flex flex-col min-h-[min(72vh,640px)]">
      {/* Toolbar — Gmail-style header */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border/40 bg-muted/10 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <Inbox className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm font-semibold">Inbox</span>
        </div>

        <div className="flex flex-col gap-1 shrink-0">
          <span className="text-[11px] font-medium text-muted-foreground">Time period</span>
          <div className="relative">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as InboxRange)}
              className={`${adminSelect} min-w-[240px] max-w-[min(100vw-2rem,320px)]`}
              aria-label="Filter messages by date"
            >
              {INBOX_RANGE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-card text-foreground">
                  {opt.label} ({rangeCounts[opt.id]})
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/70"
              aria-hidden
            />
          </div>
        </div>

        <span className="text-xs text-muted-foreground tabular-nums">
          {filtered.length} of {messages.length} message{messages.length === 1 ? "" : "s"}
        </span>

        <Button type="button" variant="outline" size="sm" className="ml-auto rounded-full h-8" onClick={onRefresh}>
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
          <MessageSquareText className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">No messages in this period.</p>
          <p className="text-xs text-muted-foreground mt-1">Choose a longer range from the dropdown.</p>
        </div>
      ) : (
        <div className="flex flex-1 min-h-0">
          {/* Message list — like Gmail left column */}
          <div
            className={`flex flex-col min-h-0 border-border/40 bg-background/30 ${
              mobileShowDetail ? "hidden md:flex" : "flex w-full md:w-[min(420px,42%)] md:border-r"
            }`}
          >
            <div className="overflow-y-auto flex-1 divide-y divide-border/30">
              {filtered.map((message) => {
                const formatted = formatContactMessagePlain(message);
                const isActive = selectedId === message.id;
                const unread = !isMessageRead(message.id);
                const snippet = (formatted.body || message.message).replace(/\s+/g, " ").trim();
                const subject = formatted.subject;
                const listDate = formatMessageListDate(message.created_at);

                return (
                  <button
                    key={message.id}
                    type="button"
                    onClick={() => handleSelect(message.id)}
                    className={`w-full text-left px-4 py-3 transition-colors hover:bg-muted/40 ${
                      isActive ? "bg-primary/10 border-l-2 border-l-primary" : "border-l-2 border-l-transparent"
                    } ${unread ? "bg-primary/[0.04]" : ""}`}
                  >
                    <div className="flex items-baseline justify-between gap-2 mb-0.5">
                      <span className="flex items-center gap-2 min-w-0">
                        {unread ? (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-primary" title="Unread" />
                        ) : null}
                        <span
                          className={`text-sm truncate ${unread || isActive ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}
                        >
                          {message.name}
                        </span>
                      </span>
                      <span className="text-[11px] text-muted-foreground shrink-0 tabular-nums">{listDate}</span>
                    </div>
                    <p className="text-xs font-medium text-foreground/80 truncate mb-0.5">{subject}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      <span className="text-muted-foreground/70">{message.email}</span>
                      {snippet ? ` — ${snippet}` : ""}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reading pane — like Gmail right panel */}
          <div
            className={`flex flex-col min-h-0 flex-1 bg-card/20 ${
              mobileShowDetail ? "flex" : "hidden md:flex"
            }`}
          >
            {selected ? (
              <>
                <div className="md:hidden border-b border-border/30 px-2 py-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setMobileShowDetail(false)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to list
                  </Button>
                </div>
                {renderReadingPane(selected)}
              </>
            ) : (
              <div className="flex-1 hidden md:flex flex-col items-center justify-center text-muted-foreground px-6">
                <Mail className="w-12 h-12 opacity-30 mb-3" />
                <p className="text-sm">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInboxPage;
