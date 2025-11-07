"use client";

// note: most of this is from chat, but i can change it i think

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import Tag from "./tag";

export default function HeaderAndBody() {
  const date = new Date();

  const [isEditable, setIsEditable] = useState(true);
  const [tagsShown, setTagsShown] = useState(false);

  const [labels, setLabels] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("labels") || "[]");
    }
    return [];
  });

  // Load from localStorage
  const [selectedTag, setSelectedTag] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedTag");
    }
    return null;
  });

  const [newTag, setNewTag] = useState("");
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
          "ProseMirror justify-left items-left outline-none text-4xl font-[var(--font-lora)] !font-[var(--font-lora)] leading-relaxed py-10 pr-10 ",
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
      setTagsShown(true);
      bodyeditor.view.dom.style.color = "#171717";
    }
    if (headereditor) headereditor.view.dom.style.color = "#171717";
  };

  const handleEdit = () => {
    setIsEditable(true); // unlock editor
    setTagsShown(false);
    if (headereditor) headereditor.view.dom.style.color = "#77777B";
    if (bodyeditor) bodyeditor.view.dom.style.color = "#77777B";
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const updated = [...labels, newTag];
    setLabels(updated);
    localStorage.setItem("labels", JSON.stringify(updated));
    setNewTag("");
  };

  // When a tag is selected
  const handleSelectTag = (tag: string) => {
    if (selectedTag) return; // Only allow selecting a tag if none is selected
    setSelectedTag(tag);
    localStorage.setItem("selectedTag", tag);
  };

  const handleDeleteTag = (tag: string) => {
    if (!selectedTag) return; // Only allow deleting a tag if a tag is selected

    setSelectedTag(null);
    localStorage.removeItem("selectedTag");
  };

  const removeTag = (tag: string) => {
    const updated = labels.filter((t) => t !== tag);
    setLabels(updated);
    localStorage.setItem("labels", JSON.stringify(updated));
  };

  return (
    <>
      <div className="flex flex-col justify-center items-start min-h-screen px-8 py-4 space-y-6 rounded-lg max-w-4xl mx-auto my-10 bg-transparent">
        <div className="text-[12px] text-[#A5A5A3] font-normal font-['Nunito']">
          {date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className="w-full max-w-4xl ">
          <EditorContent editor={bodyeditor} />
        </div>
        <div className="flex justify-between items-end space-y-4 w-full max-w-4xl p-4 text-xl">
          {isEditable ? (
            <>
              <button className="px-4 py-2 rounded-md" onClick={handleSave}>
                Save
              </button>
            </>
          ) : (
            <>
              <button className="px-4 py-2 rounded-md " onClick={handleEdit}>
                Edit
              </button>
            </>
          )}
          <div className=" flex-1 px-8 text-right">
            {tagsShown && (
              <div className="flex flex-col items-end space-y-3">
                {!selectedTag ? (
                  <>
                    <div className="flex flex-wrap justify-center gap-3">
                      {labels.length > 0 ? (
                        labels.map((label, i) => (
                          <div
                            key={i}
                            className="px-4 py-2  rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
                          >
                            <button onClick={() => handleSelectTag(label)}>
                              {label}
                            </button>
                            <button
                              className="ml-2 text-red-500 hover:text-red-700"
                              onClick={() => removeTag(label)}
                            >
                              x
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 italic">
                          No tags yet — create one below.
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="New tag incoming..."
                          className="border rounded-md px-3 py-1"
                        />
                        <button
                          onClick={handleAddTag}
                          className="bg-lightgray-500 opacity-75 px-3 py-1 rounded-md"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <Tag
                    label={selectedTag}
                    onClick={() => handleDeleteTag(selectedTag)}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-4xl">
          <EditorContent editor={headereditor} />
        </div>
      </div>
    </>
  );
}
