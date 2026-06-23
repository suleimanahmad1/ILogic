import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle, FontFamily, FontSize } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Highlighter,
  ImageIcon,
  Italic,
  Link2,
  Strikethrough,
  Underline as UnderlineIcon,
} from "lucide-react";
import { toast } from "sonner";
import { adminSelect } from "@/components/admin/adminUi";
import { getImageUploadError } from "@/lib/imageUploadLimits";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  onUploadImage?: (file: File) => Promise<string | null>;
};

type SavedSelection = { from: number; to: number };

const keepEditorSelection = (e: React.MouseEvent | React.PointerEvent) => {
  e.preventDefault();
};

const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Calibri", value: "Calibri, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
];

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "32px"];
const DEFAULT_HIGHLIGHT = "#fef08a";

const normalizeFontFamily = (value: string | undefined): string => {
  if (!value) return "";
  const match = FONT_FAMILIES.find((f) => f.value && value.toLowerCase().includes(f.value.split(",")[0].replace(/'/g, "").toLowerCase()));
  return match?.value ?? value;
};

const runWithStoredSelection = (editor: Editor, saved: SavedSelection | null, run: () => void) => {
  if (saved) {
    editor.commands.setTextSelection({ from: saved.from, to: saved.to });
  }
  editor.commands.focus();
  run();
};

const ToolbarButton = ({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onMouseDown={keepEditorSelection}
    onClick={onClick}
    className={cn(
      "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground",
      active && "bg-primary/15 text-primary"
    )}
  >
    {children}
  </button>
);

const RichTextEditor = ({ value, onChange, placeholder, rows = 6, className = "", onUploadImage }: RichTextEditorProps) => {
  const minHeight = Math.max(rows * 26, 120);
  const scrollMaxHeight = Math.min(Math.max(rows * 28, 160) + 48, 520);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const selectionRef = useRef<SavedSelection | null>(null);
  const [toolbarTick, setToolbarTick] = useState(0);
  const [highlightColor, setHighlightColor] = useState(DEFAULT_HIGHLIGHT);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder: placeholder || "Write here…" }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { class: "rich-text-inline-image" },
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "rich-text-prose focus:outline-none min-h-full",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const storeSelection = () => {
      const { from, to } = editor.state.selection;
      selectionRef.current = { from, to };
      setToolbarTick((n) => n + 1);
    };
    editor.on("selectionUpdate", storeSelection);
    editor.on("transaction", storeSelection);
    return () => {
      editor.off("selectionUpdate", storeSelection);
      editor.off("transaction", storeSelection);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const incoming = value || "";
    const current = editor.getHTML();
    if (incoming !== current && !editor.isFocused) {
      editor.commands.setContent(incoming, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  void toolbarTick;

  const setLink = () => {
    const saved = selectionRef.current;
    runWithStoredSelection(editor, saved, () => {
      const previous = editor.getAttributes("link").href as string | undefined;
      const url = window.prompt("Link URL", previous || "https://");
      if (url === null) return;
      if (url.trim() === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }
      editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
    });
  };

  const textStyle = editor.getAttributes("textStyle") as { fontFamily?: string; fontSize?: string };
  const currentFont = normalizeFontFamily(textStyle.fontFamily);
  const currentSize = textStyle.fontSize || "";
  const activeHighlight = (editor.getAttributes("highlight").color as string | undefined) || DEFAULT_HIGHLIGHT;

  const applyFontFamily = (fontFamily: string) => {
    const saved = selectionRef.current;
    runWithStoredSelection(editor, saved, () => {
      if (!fontFamily) {
        editor.chain().focus().unsetFontFamily().removeEmptyTextStyle().run();
      } else {
        editor.chain().focus().setFontFamily(fontFamily).run();
      }
    });
  };

  const applyFontSize = (fontSize: string) => {
    const saved = selectionRef.current;
    runWithStoredSelection(editor, saved, () => {
      if (!fontSize) {
        editor.chain().focus().unsetFontSize().removeEmptyTextStyle().run();
      } else {
        editor.chain().focus().setFontSize(fontSize).run();
      }
    });
  };

  const insertImage = async (file: File) => {
    if (!onUploadImage) {
      window.alert("Image upload is not available here.");
      return;
    }
    const sizeError = getImageUploadError(file);
    if (sizeError) {
      toast.error(sizeError);
      return;
    }
    const url = await onUploadImage(file);
    if (url) editor.chain().focus().setImage({ src: url, alt: file.name.replace(/\.[^.]+$/, "") }).run();
  };

  const onImageInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) await insertImage(file);
  };

  return (
    <div className={cn("rich-text-editor-shell flex flex-col rounded-lg border border-border/40 bg-background/30 overflow-hidden", className)}>
      <div
        className="rich-text-editor-toolbar sticky top-0 z-10 shrink-0 flex flex-wrap items-center gap-1 border-b border-border/40 bg-muted/20 px-2 py-1.5 backdrop-blur-md"
        onMouseDown={keepEditorSelection}
      >
        <select
          className={cn(adminSelect, "h-8 w-[7.5rem] text-xs")}
          value={currentFont}
          tabIndex={-1}
          onPointerDown={keepEditorSelection}
          onMouseDown={keepEditorSelection}
          onChange={(e) => applyFontFamily(e.target.value)}
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <select
          className={cn(adminSelect, "h-8 w-[4.5rem] text-xs")}
          value={currentSize}
          tabIndex={-1}
          onPointerDown={keepEditorSelection}
          onMouseDown={keepEditorSelection}
          onChange={(e) => applyFontSize(e.target.value)}
        >
          <option value="">Size</option>
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size.replace("px", "")}
            </option>
          ))}
        </select>

        <span className="mx-1 h-6 w-px bg-border/50" aria-hidden />

        <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <label
          className="relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-muted/50"
          title="Text color"
          onMouseDown={keepEditorSelection}
        >
          <span className="text-sm font-semibold leading-none pointer-events-none">A</span>
          <input
            type="color"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onMouseDown={keepEditorSelection}
            onChange={(e) => {
              const saved = selectionRef.current;
              runWithStoredSelection(editor, saved, () => {
                editor.chain().focus().setColor(e.target.value).run();
              });
            }}
          />
        </label>

        <label
          className={cn(
            "relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-muted/50",
            editor.isActive("highlight") && "bg-primary/15 text-primary"
          )}
          title="Highlight color"
          onMouseDown={keepEditorSelection}
        >
          <Highlighter className="h-4 w-4 pointer-events-none" />
          <input
            type="color"
            value={activeHighlight}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onMouseDown={keepEditorSelection}
            onChange={(e) => {
              setHighlightColor(e.target.value);
              const saved = selectionRef.current;
              runWithStoredSelection(editor, saved, () => {
                editor.chain().focus().setHighlight({ color: e.target.value }).run();
              });
            }}
          />
        </label>
        <ToolbarButton title="Remove highlight" active={false} onClick={() => editor.chain().focus().unsetHighlight().run()}>
          <span className="text-[10px] font-mono">✕</span>
        </ToolbarButton>

        <ToolbarButton title="Link" active={editor.isActive("link")} onClick={setLink}>
          <Link2 className="h-4 w-4" />
        </ToolbarButton>

        {onUploadImage ? (
          <>
            <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={onImageInputChange} />
            <ToolbarButton title="Insert image (max 2 MB)" onClick={() => imageInputRef.current?.click()}>
              <ImageIcon className="h-4 w-4" />
            </ToolbarButton>
          </>
        ) : null}

        <span className="mx-1 h-6 w-px bg-border/50" aria-hidden />

        <ToolbarButton title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Justify" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="rich-text-editor-body overflow-y-auto overflow-x-hidden px-3 py-2" style={{ maxHeight: scrollMaxHeight, minHeight }}>
        <EditorContent editor={editor} className="rich-text-editor" />
      </div>
    </div>
  );
};

export default RichTextEditor;
