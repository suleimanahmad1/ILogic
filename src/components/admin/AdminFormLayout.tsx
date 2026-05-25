import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  adminCard,
  adminCardBody,
  adminCardHeader,
  adminCardTitle,
  adminFieldLabel,
  adminSectionTitle,
} from "@/components/admin/adminUi";

type IconType = React.ComponentType<{ className?: string }>;

export const AdminFormCard = ({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: IconType;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) => (
  <div className={adminCard}>
    <div className={adminCardHeader}>
      <div>
        <div className={adminCardTitle}>
          <Icon className="w-4 h-4 text-primary shrink-0" />
          <span>{title}</span>
        </div>
        {subtitle ? <p className="text-xs text-muted-foreground mt-1 pl-6">{subtitle}</p> : null}
      </div>
    </div>
    <div className={adminCardBody}>{children}</div>
  </div>
);

export const AdminField = ({
  label,
  required,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <label className={adminFieldLabel}>
      {label}
      {required ? <span className="text-primary ml-0.5">*</span> : null}
    </label>
    {children}
  </div>
);

export const AdminFieldGrid = ({ children, cols = 2 }: { children: ReactNode; cols?: 1 | 2 | 3 }) => (
  <div
    className={
      cols === 1
        ? "grid gap-4"
        : cols === 3
          ? "grid gap-4 md:grid-cols-3"
          : "grid gap-4 md:grid-cols-2"
    }
  >
    {children}
  </div>
);

export const AdminFormDivider = ({ label }: { label: string }) => (
  <div>
    <p className={adminSectionTitle}>{label}</p>
    <div className="h-px bg-border/30" />
  </div>
);

export const AdminFormActions = ({
  saveLabel,
  editing,
  onSave,
  onCancel,
  disabled,
}: {
  saveLabel: string;
  editing?: boolean;
  onSave: () => void;
  onCancel?: () => void;
  disabled?: boolean;
}) => (
  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/25">
    <Button onClick={onSave} disabled={disabled} size="sm" className="rounded-full px-5">
      <Plus className="w-4 h-4 mr-1.5" />
      {editing ? `Update ${saveLabel}` : `Add ${saveLabel}`}
    </Button>
    {editing && onCancel ? (
      <Button type="button" variant="outline" size="sm" onClick={onCancel} className="rounded-full border-border/50">
        Cancel
      </Button>
    ) : null}
  </div>
);

export const AdminListHeader = ({ title, count }: { title: string; count: number }) => (
  <div className="flex items-center justify-between gap-2 px-1">
    <p className="text-xs font-medium text-muted-foreground">{title}</p>
    <span className="text-[10px] font-mono text-primary/80 tabular-nums">{count}</span>
  </div>
);

export const AdminEntryCard = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`rounded-xl border border-border/35 bg-card/25 p-4 transition-colors hover:border-border/55 ${className}`}>
    {children}
  </div>
);
