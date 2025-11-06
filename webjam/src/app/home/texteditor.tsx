"use client";

// note: most of this is from chat, but i can change it i think

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";

export default function PaperTiptap() {
  const [isEditable, setIsEditable] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const [labels, setLabels] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("labels") || "[]");
    }
    return [];
  });

  // Load from localStorage
  // const savedContent =
  //   typeof window !== "undefined" ? localStorage.getItem("paper-tiptap") : "";
  // const initialContent =
  //   savedContent && savedContent.trim() !== "<p></p>" ? savedContent : "";
    // Load from localStorage
  const savedContent =
    typeof window !== "undefined" ? localStorage.getItem("paper-tiptap") : "";
  const savedDate = 
    typeof window !== "undefined" ? localStorage.getItem("paper-tiptap-date") : "";
  const today = new Date().toLocaleDateString();
  
  const initialContent =
    savedContent && savedDate === today && savedContent.trim() !== "<p></p>" 
      ? savedContent 
      : "";

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

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable);
    }
  }, [editor, isEditable]);

  const handleSave = async () => {
    if (editor) {
      const date = new Date()

      const content = editor.getText();
      localStorage.setItem("paper-tiptap", content); // save content
      localStorage.setItem("paper-tiptap-date", date.toLocaleDateString()); // save content
      setIsEditable(false); // lock editor
      console.log("Saved content:", content);

      // Write to DB
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

      if (isEdit)
      {
        // Write updates to DB
        const res = await fetch(`${baseUrl}/api/update_entry`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({uid: "ff47c2bd-3de5-4daa-a782-655a8e1a09a8", date: date.toLocaleDateString(), title: "N/A", description: content}),
          }
        )
        const data = await res.json();
      } 
      else
      {
        const res = await fetch(`${baseUrl}/api/add_entry`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({uid: "ff47c2bd-3de5-4daa-a782-655a8e1a09a8", date: date.toLocaleDateString(), title: "N/A", description: content}),
          }
        )
        const data = await res.json();
      }

      // TODO: IF IT DIDN'T SAVE -> DISPLAY SOME KIND OF MESSAGE
    }
  };

  const handleEdit = async () => {
    if (editor) {
      const content = editor.getHTML();

      setIsEditable(true); // unlock editor
      console.log("edit content:", content);
      setIsEdit(true);
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
      <div className="flex justify-center items-center bg-[#f5f2e9] p-8 max-w-screen">
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
