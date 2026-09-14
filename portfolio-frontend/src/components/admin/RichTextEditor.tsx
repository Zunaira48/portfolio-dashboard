"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import ListItem from "@tiptap/extension-list-item";
import { DOMParser as ProseMirrorDOMParser } from "@tiptap/pm/model";
import { Bold, Italic, List, ListOrdered, ChevronDown } from "lucide-react";

// A single combined extension of TextStyle carrying both the fontSize and
// fontWeight attributes. Having three separate extensions that each secretly
// register under the same internal name ("textStyle") is what caused the
// "Duplicate extension names" warning — Tiptap only expects one.
const CustomTextStyle = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontSize || null,
        renderHTML: (attributes: { fontSize?: string | null }) => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
      fontWeight: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.fontWeight || null,
        renderHTML: (attributes: { fontWeight?: string | null }) => {
          if (!attributes.fontWeight) return {};
          return { style: `font-weight: ${attributes.fontWeight}` };
        },
      },
    };
  },
});

// A list item can only ever contain plain paragraphs — never a heading. This is
// what stops "press Enter after a heading-styled bullet" from producing another
// heading-styled bullet: the schema simply won't allow a heading inside a list item.
const PlainListItem = ListItem.extend({
  content: "paragraph+",
});

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// A custom, non-native dropdown. Native <select> elements can silently move or
// collapse the editor's text selection when clicked, which is what was causing
// formatting to land on the wrong text. onMouseDown here is deliberately
// prevented so the editor's current selection is never disturbed by opening
// or choosing from this menu.
function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value)?.label ?? label;

  return (
    <div className="relative">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        className="text-xs rounded-md border border-border bg-bg px-2 py-1.5 text-text flex items-center gap-1 min-w-28 justify-between"
      >
        {current}
        <ChevronDown size={13} />
      </button>
      {open ? (
        <div className="absolute z-20 top-full left-0 mt-1 min-w-37.5 rounded-md border border-border bg-bg shadow-lg overflow-hidden">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={
                o.value === value
                  ? "block w-full text-left text-xs px-3 py-2 bg-accent text-white"
                  : "block w-full text-left text-xs px-3 py-2 text-text hover:bg-bg-soft"
              }
            >
              {o.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  children,
  label,
}: {
  onClick: () => void;
  active: boolean;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      title={label}
      className={
        active
          ? "p-1.5 rounded-md bg-accent text-white"
          : "p-1.5 rounded-md text-text-muted hover:bg-bg hover:text-text transition-colors"
      }
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ listItem: false }),
      PlainListItem,
      CustomTextStyle,
      FontFamily,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rich-content min-h-[220px] px-3 py-2 focus:outline-none",
      },
      // Fixes pasted text landing as one giant unbroken block. Real formatted
      // paste (actual HTML from Word/Docs) is left completely alone below.
      handlePaste(view, event) {
        const html = event.clipboardData?.getData("text/html");
        if (html && html.trim().length > 0) return false;

        const text = event.clipboardData?.getData("text/plain");
        if (!text) return false;

        event.preventDefault();

        const bodyHtml = text
          .split(/\r?\n/)
          .map((line) => (line.trim().length ? `<p>${escapeHtml(line)}</p>` : "<p></p>"))
          .join("");

        const dom = new DOMParser().parseFromString(bodyHtml, "text/html");
        const slice = ProseMirrorDOMParser.fromSchema(view.state.schema).parseSlice(dom.body);
        view.dispatch(view.state.tr.replaceSelection(slice));
        return true;
      },
    },
  });

  if (!editor) return null;

  const ed: Editor = editor;

  const currentBlockType = ed.isActive("heading", { level: 2 })
    ? "h2"
    : ed.isActive("heading", { level: 3 })
    ? "h3"
    : "p";

  function setBlockType(v: string) {
    if (v === "p") ed.chain().focus().setParagraph().run();
    if (v === "h2") ed.chain().focus().setHeading({ level: 2 }).run();
    if (v === "h3") ed.chain().focus().setHeading({ level: 3 }).run();
  }

  function setFontFamily(v: string) {
    if (v === "default") ed.chain().focus().unsetFontFamily().run();
    else ed.chain().focus().setFontFamily(v).run();
  }

  function setFontWeight(v: string) {
    if (v === "default") ed.chain().focus().setMark("textStyle", { fontWeight: null }).run();
    else ed.chain().focus().setMark("textStyle", { fontWeight: v }).run();
  }

  return (
    <div className="rounded-lg border border-border bg-bg-soft overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-2">
        <Dropdown
          label="Normal text"
          value={currentBlockType}
          onChange={setBlockType}
          options={[
            { value: "p", label: "Normal text" },
            { value: "h2", label: "Heading" },
            { value: "h3", label: "Subheading" },
          ]}
        />

        <Dropdown
          label="Default font"
          value="default"
          onChange={setFontFamily}
          options={[
            { value: "default", label: "Default font" },
            { value: '"Times New Roman", serif', label: "Times New Roman" },
            { value: "Arial, sans-serif", label: "Arial" },
            { value: '"Courier New", monospace', label: "Courier (monospace)" },
          ]}
        />

        <Dropdown
          label="Weight"
          value="default"
          onChange={setFontWeight}
          options={[
            { value: "default", label: "Normal weight" },
            { value: "500", label: "Medium (500)" },
            { value: "700", label: "Bold (700)" },
          ]}
        />
      </div>

      <div className="flex items-center gap-1 border-b border-border p-1.5">
        <ToolbarButton label="Bold" active={ed.isActive("bold")} onClick={() => ed.chain().focus().toggleBold().run()}>
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={ed.isActive("italic")} onClick={() => ed.chain().focus().toggleItalic().run()}>
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={ed.isActive("bulletList")}
          onClick={() => ed.chain().focus().toggleBulletList().run()}
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={ed.isActive("orderedList")}
          onClick={() => ed.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={15} />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}