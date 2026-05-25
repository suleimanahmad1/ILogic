import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { adminInput } from "@/components/admin/adminUi";

type Props = {
  value: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string | null>;
  placeholder?: string;
  fullImagePreview?: boolean;
};

const AdminImageField = ({
  value,
  onChange,
  onUpload,
  placeholder = "Paste URL or upload image",
  fullImagePreview = false,
}: Props) => (
  <div className="rounded-xl border border-dashed border-border/40 bg-muted/10 p-3 space-y-3">
    <div className="flex flex-col sm:flex-row gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${adminInput} flex-1`}
      />
      <label className="inline-flex items-center justify-center gap-2 text-xs font-medium text-foreground cursor-pointer rounded-full border border-primary/30 bg-primary/10 px-4 py-2 hover:bg-primary/15 transition-colors shrink-0">
        <Upload className="w-3.5 h-3.5" />
        Upload file
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              const url = await onUpload(file);
              if (url) onChange(url);
            } catch {
              /* ignore */
            }
            e.target.value = "";
          }}
        />
      </label>
    </div>
    {value ? (
      <div className="flex justify-center rounded-lg bg-background/40 p-2 border border-border/30">
        <img
          src={value}
          alt="Preview"
          className={`rounded-md max-h-44 ${
            fullImagePreview ? "object-contain w-full max-w-sm" : "object-cover w-full max-h-36"
          }`}
        />
      </div>
    ) : (
      <p className="text-[10px] text-center text-muted-foreground">No image yet</p>
    )}
  </div>
);

export default AdminImageField;
