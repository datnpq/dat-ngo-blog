"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { common, createLowlight } from "lowlight";
import { useEffect, useRef, useState } from "react";

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  error?: string;
}

type BtnProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
};

function Btn({ onClick, active, disabled, title, children }: BtnProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={`px-2 py-1 rounded text-sm font-medium transition-colors min-w-[28px] ${
        active
          ? "bg-blue-100 text-blue-700"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-neutral-200 mx-0.5 self-center" />;
}

export function TiptapEditor({ value, onChange, error }: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Highlight,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl border border-[#E9E9E9] max-w-full" } }),
    ],
    content: value || "<p></p>",
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
    editorProps: {
      attributes: { class: "ProseMirror focus:outline-none" },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [value, editor]);

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) {
        editor?.chain().focus().setImage({ src: data.url, alt: file.name }).run();
      } else {
        alert(data.error || "Upload thất bại");
      }
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      e.preventDefault();
      handleImageUpload(file);
    }
  }

  function setLink() {
    const url = window.prompt("URL liên kết:");
    if (!url) return;
    editor?.chain().focus().setLink({ href: url }).run();
  }

  if (!editor) return null;

  return (
    <div className={`border rounded-2xl overflow-hidden ${error ? "border-red-300" : "border-[#E9E9E9]"}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-neutral-50 border-b border-[#E9E9E9]">
        {/* Text style */}
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)">
          <strong>B</strong>
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)">
          <em>I</em>
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
          <s>S</s>
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight">
          <span className="bg-yellow-200 px-0.5 rounded text-xs">H</span>
        </Btn>

        <Divider />

        {/* Headings */}
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">H1</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">H2</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">H3</Btn>

        <Divider />

        {/* Lists */}
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
          <span className="text-xs">•≡</span>
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered list">
          <span className="text-xs">1≡</span>
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
          <span className="text-base leading-none">"</span>
        </Btn>

        <Divider />

        {/* Code */}
        <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
          <span className="font-mono text-xs">`…`</span>
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">
          <span className="font-mono text-xs">{`</>`}</span>
        </Btn>

        <Divider />

        {/* Link */}
        <Btn onClick={setLink} active={editor.isActive("link")} title="Chèn link">
          🔗
        </Btn>
        <Btn onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} title="Xóa link">
          <span className="line-through text-xs">🔗</span>
        </Btn>

        {/* Image */}
        <Btn
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Chèn ảnh (jpg/png/webp, tối đa 5MB)"
        >
          {uploading ? (
            <span className="text-xs animate-pulse">⏳</span>
          ) : (
            <span className="text-xs">🖼</span>
          )}
        </Btn>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />

        <Divider />

        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Đường kẻ ngang">
          <span className="text-xs">—</span>
        </Btn>

        <div className="flex-1" />

        {/* History */}
        <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">↩</Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">↪</Btn>
      </div>

      {/* Editor content area */}
      <div
        className="bg-white"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <EditorContent editor={editor} />
      </div>

      {uploading && (
        <div className="px-4 py-2 text-xs text-blue-600 bg-blue-50 border-t border-blue-100 flex items-center gap-2">
          <span className="animate-spin">⏳</span> Đang tải ảnh lên...
        </div>
      )}
      {error && (
        <p className="px-4 py-2 text-xs text-red-600 bg-red-50 border-t border-red-100">{error}</p>
      )}
    </div>
  );
}
