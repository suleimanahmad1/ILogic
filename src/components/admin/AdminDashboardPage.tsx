import { Award, BookOpen, FolderOpen, GraduationCap, Inbox, SquareStack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMessageListDate, parseContactMessageBody, type ContactMessage } from "@/lib/contactInbox";
import { isMessageRead } from "@/lib/inboxRead";

type PageKey = "dashboard" | "contact" | "inbox" | "skills" | "education" | "certifications" | "projects" | "blogs";

type Props = {
  projectsCount: number;
  certificationsCount: number;
  blogsCount: number;
  publishedBlogsCount: number;
  educationCount: number;
  skillCategoriesCount: number;
  skillItemsCount: number;
  unreadCount: number;
  messages: ContactMessage[];
  onNavigate: (page: PageKey) => void;
};

const StatCard = ({
  label,
  value,
  hint,
  icon: Icon,
  onClick,
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-xl border border-border/40 bg-card/40 p-4 text-left hover:border-primary/35 hover:bg-primary/5 transition-colors"
  >
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold mt-1 tabular-nums">{value}</p>
        {hint ? <p className="text-xs text-muted-foreground mt-1">{hint}</p> : null}
      </div>
      <Icon className="w-5 h-5 text-primary/70 shrink-0" />
    </div>
  </button>
);

const AdminDashboardPage = ({
  projectsCount,
  certificationsCount,
  blogsCount,
  publishedBlogsCount,
  educationCount,
  skillCategoriesCount,
  skillItemsCount,
  unreadCount,
  messages,
  onNavigate,
}: Props) => {
  const recentMessages = messages.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Overview of your portfolio content and inbox.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Projects" value={projectsCount} icon={FolderOpen} onClick={() => onNavigate("projects")} />
        <StatCard label="Certifications" value={certificationsCount} icon={Award} onClick={() => onNavigate("certifications")} />
        <StatCard
          label="Blogs"
          value={blogsCount}
          hint={`${publishedBlogsCount} published`}
          icon={BookOpen}
          onClick={() => onNavigate("blogs")}
        />
        <StatCard
          label="Inbox"
          value={unreadCount > 0 ? `${unreadCount} new` : messages.length}
          hint={messages.length ? `${messages.length} total messages` : "No messages yet"}
          icon={Inbox}
          onClick={() => onNavigate("inbox")}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label="Education" value={educationCount} icon={GraduationCap} onClick={() => onNavigate("education")} />
        <StatCard
          label="Skills"
          value={skillItemsCount}
          hint={`${skillCategoriesCount} categories`}
          icon={SquareStack}
          onClick={() => onNavigate("skills")}
        />
      </div>

      <div className="rounded-xl border border-border/40 bg-card/30 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border/30 px-4 py-3">
          <h3 className="text-sm font-semibold">Recent inbox</h3>
          <Button type="button" variant="outline" size="sm" className="h-8 rounded-full" onClick={() => onNavigate("inbox")}>
            Open inbox
          </Button>
        </div>
        {recentMessages.length === 0 ? (
          <p className="text-sm text-muted-foreground px-4 py-8 text-center">No contact messages yet.</p>
        ) : (
          <ul className="divide-y divide-border/30">
            {recentMessages.map((message) => {
              const parsed = parseContactMessageBody(message.message);
              const unread = !isMessageRead(message.id);
              return (
                <li key={message.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate("inbox")}
                    className="w-full text-left px-4 py-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm truncate ${unread ? "font-semibold" : "font-medium"}`}>
                        {unread ? "● " : ""}
                        {message.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground shrink-0">{formatMessageListDate(message.created_at)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {parsed.service || "Contact form"} — {parsed.description || message.message}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
