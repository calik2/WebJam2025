"use client";

// note: most of this is from chat, but i can change it i think

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";

export default function PaperTiptap() {
  const [isEditable, setIsEditable] = useState(true);

  const [labels, setLabels] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("labels") || "[]");
    }
    return [];
  });

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
    editable: isEditable,
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "ProseMirror justify-left items-left outline-none text-4xl font-[var(--font-lora)] !font-[var(--font-lora)] leading-relaxed p-10 ",
        style: `         
          color: #77777B;
          font-family: Lora;
          font-size 40px;
          font-style: normal;
          font-weight: 400;
          line-height: 51px;
          text-align: left;
        `,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      localStorage.setItem("paper-tiptap", html);
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable);
    }
  }, [editor, isEditable]);

  const handleSave = () => {
    if (editor) {
      const content = editor.getHTML();
      localStorage.setItem("paper-tiptap", content); // save content
      setIsEditable(false); // lock editor
      console.log("Saved content:", content);
    }
  };

  const handleEdit = () => {
    if (editor) {
      const content = editor.getHTML();

      setIsEditable(true); // unlock editor
      console.log("edit content:", content);
    }
  };

  const handleTag = () => {
    const newLabel = prompt("Enter a tag/label for this note:");
    if (!newLabel) return;

    const updatedLabels = [...new Set([...labels, newLabel.trim()])];
    setLabels(updatedLabels);
    localStorage.setItem("labels", JSON.stringify(updatedLabels));

    alert(`Tag "${newLabel}" saved!`);
  };

  return (
    <>
      <div className="flex justify-left items-left bg-[#f5f2e9] p-8 max-w-screen">
        <EditorContent editor={editor} />
      </div>
      <div className="flex justify-center space-x-4 p-4 text-xl">
        {isEditable ? (
          <>
            <button className="px-4 py-2 rounded-md" onClick={handleSave}>
              Save
            </button>
            <button className="px-4 py-2 rounded-md " onClick={handleTag}>
              Tag
            </button>
          </>
        ) : (
          <>
            <button className="px-4 py-2 rounded-md " onClick={handleEdit}>
              Edit
            </button>
          </>
        )}
      </div>
    </>
  );
}
