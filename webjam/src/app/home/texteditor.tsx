"use client";

// note: most of this is from chat, but i can change it i think

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

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
        placeholder: "What did I learn today?",
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "ProseMirror justify-center items-center outline-none text-4xl font-[var(--font-lora)] !font-[var(--font-lora)] leading-relaxed p-10 ",
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

  const handleSave = () => {
    if (editor) {
      const content = editor.getHTML();
      localStorage.setItem("paper-tiptap", content); // save content
      editor.setEditable(false); // lock editor
      console.log("Saved content:", content);
    }
  };

  const handleEdit = () => {
    if (editor) {
      const content = editor.getHTML();

      editor.setEditable(true); // lock editor
      console.log("edit content:", content);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center bg-[#f5f2e9] p-8 max-w-screen">
        <EditorContent editor={editor} />
      </div>
      <div className="flex justify-center space-x-4 p-4 text-xl">
        <button className="rounded-md dark:bg-black " onClick={handleSave}>
          save
        </button>
        <button className="rounded-md dark:bg-black" onClick={handleEdit}>
          edit
        </button>
      </div>
    </>
  );
}
