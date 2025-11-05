"use client";

// note: most of this is from chat, but i can change it i think

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

export default function PaperTiptap() {
  // Load from localStorage
  const savedContent =
    typeof window !== "undefined" ? localStorage.getItem("paper-tiptap") : "";
  const initialContent =
    savedContent && savedContent.trim() !== "<p></p>" ? savedContent : "";

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "What did you learn today?",
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "ProseMirror justify-center items-center outline-none text-xl font-[var(--font-lora)] leading-relaxed p-10 ",
        style: `         
          line-height: 28px;
          color: #222;
        `,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      localStorage.setItem("paper-tiptap", html);
    },
  });

  return (
    <div className="justify-center bg-[#f5f2e9] p-8">
      <EditorContent editor={editor} />
    </div>
  );
}
