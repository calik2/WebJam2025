"use client";

// note: most of this is from chat, but i can change it i think

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";

export default function HeaderAndBody() {
  const date = new Date();

  const [isEditable, setIsEditable] = useState(true);

  const [labels, setLabels] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("labels") || "[]");
    }
    return [];
  });

  // Load from localStorage
  const savedContent =
    typeof window !== "undefined" ? localStorage.getItem("body-tiptap") : "";
  const savedHeader =
    typeof window !== "undefined" ? localStorage.getItem("header-tiptap") : "";
  const initialContent =
    savedContent && savedContent.trim() !== "<p></p>" ? savedContent : "";

  const bodyeditor = useEditor({
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
      localStorage.setItem("body-tiptap", html);
    },
  });

  const headereditor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Title your learning...",
      }),
    ],
    editable: isEditable,
    content: savedHeader && savedHeader.trim() !== "<p></p>" ? savedHeader : "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "ProseMirror justify-left items-left outline-none text-4xl font-[var(--font-lora)] !font-[var(--font-lora)] leading-relaxed p-10 ",
        style: `         
          color: #77777B;
          font-family: Lora;
          font-size: 25px;
          font-style: normal;
          font-weight: 400;
          line-height: 51px;
          text-align: left;
        `,
      },
    },
    onUpdate: ({ editor }) => {
      localStorage.setItem("header-tiptap", editor.getHTML());
    },
  });

  useEffect(() => {
    if (headereditor) headereditor.setEditable(isEditable);
    if (bodyeditor) bodyeditor.setEditable(isEditable);
  }, [isEditable, headereditor, bodyeditor]);

  const handleSave = () => {
    if (bodyeditor) {
      localStorage.setItem("body-tiptap", bodyeditor.getHTML()); // save content
      localStorage.setItem("header-tiptap", headereditor?.getHTML() || ""); // save content
      setIsEditable(false); // lock editor
    }
  };

  const handleEdit = () => {
    setIsEditable(true); // unlock editor
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
      <div className="flex flex-col justify-left items-left p-2 max-w-screen">
        <div className="text-center my-8 text-xl font-semibold font-[var(--font-sans)]">
          {date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <EditorContent editor={bodyeditor} />
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
      <div className="fixed bottom-0 left-0 w-full p-4 z-50">
        <div className="max-w-3xl ">
          <EditorContent editor={headereditor} />
        </div>
      </div>
    </>
  );
}
