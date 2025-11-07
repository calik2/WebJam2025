"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";

export default function HeaderAndBody() {
  const date = new Date();
  const formattedDate = date
    .toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const [isEditable, setIsEditable] = useState(true);
  const [tagsShown, setTagsShown] = useState(true);
  const [entry, setEntry] = useState<{
    entry_id: number;
    date: string;
    title: string;
    description: string;
    uid: string;
  }>({ entry_id: 0, date: "", title: "", description: "", uid: "" });
  const [entryTags, setEntryTags] = useState<{ tag_id: number }[]>([]);
  const [allTags, setAllTags] = useState<{ tag_id: number; name: string }[]>(
    []
  );
  const [editingTags, setEditingTags] = useState(false); // edit mode toggle
  const [newTagName, setNewTagName] = useState(""); // for adding new tag
  const [tagsMap, setTagsMap] = useState<{ [tagId: number]: string }>({});
  const [hasText, setHasText] = useState(false);

  const savedHeader =
    typeof window !== "undefined" ? localStorage.getItem("header-tiptap") : "";
  const savedContent =
    typeof window !== "undefined" ? localStorage.getItem("paper-tiptap") : "";
  const savedDate =
    typeof window !== "undefined"
      ? localStorage.getItem("paper-tiptap-date")
      : "";
  const today = new Date().toLocaleDateString();

  const initialContent =
    savedContent && savedDate === today && savedContent.trim() !== "<p></p>"
      ? savedContent
      : "";

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
          "ProseMirror justify-left items-left outline-none text-4xl font-[var(--font-lora)] !font-[var(--font-lora)] leading-relaxed py-10 pr-10",
        style: `         
          color: #77777B;
          font-family: Lora;
          font-size: 40px;
          font-style: normal;
          font-weight: 400;
          line-height: 51px;
          text-align: left;
          min-height: 200px;
          width: 105%;
        `,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText().trim();
      setHasText(text.length > 0);
      localStorage.setItem("body-tiptap", html);
    },
  });

  const headereditor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "ADD A TITLE",
      }),
    ],
    editable: isEditable,
    content: savedHeader && savedHeader.trim() !== "<p></p>" ? savedHeader : "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "ProseMirror inline-flex items-center outline-none font-['Nunito'] !font-['Nunito']",
        style: `         
          color: #77777B;
          font-family: Nunito;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          text-align: left;
          min-height: auto;
          width: fit-content;
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

  useEffect(() => {
    if (bodyeditor) {
      const text = bodyeditor.getText().trim();
      setHasText(text.length > 0);
    }
  }, [bodyeditor]);

  useEffect(() => {
    if (entry && entry.description && bodyeditor) {
      bodyeditor.commands.setContent(entry.description);
    }

    if (entry && entry.title && headereditor) {
      headereditor.commands.setContent(entry.title);
    }
  }, [entry, bodyeditor, headereditor]);

  const handleSave = async (): Promise<void> => {
    if (bodyeditor) {
      const date = new Date();

      const content = bodyeditor.getText();
      localStorage.setItem("paper-tiptap-date", date.toLocaleDateString()); // save content
      localStorage.setItem("body-tiptap", bodyeditor.getHTML()); // save content
      localStorage.setItem("header-tiptap", headereditor?.getHTML() || ""); // save content
      setTagsShown(true);
      setIsEditable(false); // lock editor
      bodyeditor.view.dom.style.color = "#353D48";
      bodyeditor.view.dom.style.fontSize = "40px";
      if (headereditor) {
        headereditor.view.dom.style.color = "#353D48";
        headereditor.view.dom.style.fontSize = "16px";
        headereditor.view.dom.style.fontFamily = "Nunito";
        headereditor.view.dom.style.fontWeight = "400";
      }
      console.log("Saved content:", content);

      if (entry && entry.entry_id) {
        // Entry exists → update
        const res = await fetch(`${baseUrl}/api/update_entry`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            entry_id: entry.entry_id,
            date: date.toLocaleDateString(),
            title: headereditor?.getText(),
            description: content,
          }),
        });
        await res.json();
      } else {
        // No entry yet → add new
        const res = await fetch(`${baseUrl}/api/add_entry`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: date.toLocaleDateString(),
            title: headereditor?.getText(),
            description: content,
          }),
        });
        const data = await res.json();
      }
      localStorage.removeItem("paper-tiptap");
      localStorage.removeItem("header-tiptap");
      // TODO: IF IT DIDN'T SAVE -> DISPLAY SOME KIND OF MESSAGE
      // TODO: NEED TO UPDATE SO THAT AFTER LEAVING HOME AND GOING TO NOTES, IF A NOTE WAS SAVED WE WANT TO SHOW EDIT NOT JUST SAVE
    }
  };

  const handleEdit = async () => {
    if (bodyeditor) {
      const content = bodyeditor.getHTML();

      setIsEditable(true); // unlock editor
      console.log("edit content:", content);
      setTagsShown(false);
      bodyeditor.view.dom.style.color = "#77777B";
      bodyeditor.view.dom.style.fontSize = "40px";
    }

    if (headereditor) {
      headereditor.view.dom.style.color = "#77777B";
      headereditor.view.dom.style.fontSize = "16px";
      headereditor.view.dom.style.fontFamily = "Nunito";
      headereditor.view.dom.style.fontWeight = "400";
    }
  };

  // Add new tag to DB
  const handleAddNewTag = async () => {
    if (!newTagName.trim()) return;
    const res = await fetch(`${baseUrl}/api/tags/add_tag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTagName }),
    });
    const data = await res.json();
    setAllTags([...allTags, data.user]);
    setNewTagName("");
  };

  // Remove tag from this entry
  const handleRemoveTagFromEntry = async (tag_id: number) => {
    await fetch(`${baseUrl}/api/entry_tags/delete_entry_tag`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entry_id: entry.entry_id, tag_id: tag_id }),
    });
    setEntryTags(entryTags.filter((t) => t.tag_id !== tag_id));
  };

  // Add existing tag to this entry
  const handleAddTagToEntry = async (tag_id: number) => {
    await fetch(`${baseUrl}/api/entry_tags/add_entry_tag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entry_id: entry.entry_id, tag_id }),
    });
    const tag = allTags.find((t) => t.tag_id === tag_id);
    if (tag) setEntryTags([...entryTags, tag]);
  };

  // Delete tag completely from DB
  const handleDeleteTagFromDB = async (tag_id: number) => {
    await fetch(`${baseUrl}/api/tags/delete_tag`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag_id }),
    });
    setAllTags((prev) => prev.filter((t) => t.tag_id !== tag_id));
    setEntryTags((prev) => prev.filter((t) => t.tag_id !== tag_id));
  };

  //get tags when loading
  useEffect(() => {
    const fetchEntryAndTags = async () => {
      // Fetch today's entry
      const res = await fetch(
        `${baseUrl}/api/get_entry?&date=${today}`
      );
      const data = await res.json();
      setEntry(data.body);

      // Fetch tags for this entry
      if (data.body?.entry_id) {
        const resEntryTags = await fetch(
          `${baseUrl}/api/entry_tags/get_entry_tag?entry_id=${data.body.entry_id}`
        );
        const tagsData = await resEntryTags.json();
        setEntryTags(tagsData.body || []);
      }

      // Fetch all tags for user
      const resAll = await fetch(
        `${baseUrl}/api/tags/get_all_tags`
      );
      const dataAll = await resAll.json();
      const allTagsData = dataAll.body || [];
      setAllTags(allTagsData);

      // Build map of tag_id → name
      const map: { [tagId: number]: string } = {};
      allTagsData.forEach((t: { tag_id: number; name: string }) => {
        map[t.tag_id] = t.name;
      });
      setTagsMap(map);
    };

    fetchEntryAndTags();
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center items-start min-h-screen px-8 py-4 space-y-6 rounded-lg max-w-6xl mx-auto my-10 bg-transparent">
        <div className="flex flex-col gap-4" style={{ width: "105%" }}>
          <div className="flex flex-wrap items-center gap-4">
            <div
              className="inline-flex items-center text-[16px] text-[#77777B] font-['Nunito'] tracking-wide"
            >
              {formattedDate}
            </div>
            <div
              className="inline-flex ml-auto"
              style={{ transform: "translateX(53px)" }}
            >
              <EditorContent editor={headereditor} />
            </div>
          </div>

          <div className="font-normal font-[var(--font-sans)]">
            <EditorContent editor={bodyeditor} />
          </div>
        </div>

        <div className="flex justify-between items-center w-full max-w-4xl p-4 text-xl gap-6">
          {/* tags */}
          {tagsShown && (
              <div className="relative flex flex-col space-y-3">
                {/* Current tags for this entry */}
                <div className="flex flex-wrap gap-2">
                  {entryTags.length > 0 ? (
                    entryTags.map((tag) => (
                      <div
                        key={tag.tag_id}
                        className="flex items-center px-4 py-1 rounded-full text-[#62beff] border-1 transition duration-200 ease-in-out hover:scale-105"
                      >
                        <span>{tagsMap[tag.tag_id]}</span>
                        {editingTags && (
                          <button
                            onClick={() => handleRemoveTagFromEntry(tag.tag_id)}
                            className="ml-2 hover:text-[#2e74a7]"
                          >
                            -
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500 italic">No tags yet</span>
                  )}
                  <div className="flex items-center gap-2">
                      {editingTags && (
                        <div className="relative w-full max-w-xs">
                        <input
                          type="text"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          placeholder="create new tag..."
                          className="w-full border rounded-full px-3 py-1 pr-16 border-[#E48ABF] focus:border-[#a00a67] focus:outline-none" // extra right padding for button
                        />
                        <button
                          onClick={handleAddNewTag}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-[#E48ABF] 
                          border-[#E48ABF] border-1 transition duration-300 ease-in-out hover:scale-110">                        
                          +
                        </button>
                      </div>
                      )}
                      <button
                        className="relative overflow-hidden transition duration-300 ease-in-out hover:scale-105 text-[#E48ABF]"
                        style={{
                          padding: "4.4px 20px 4.4px 20px",
                          borderRadius: "36px",
                          border: "1px solid #E48ABF",
                          background:
                            "linear-gradient(180deg, rgba(233, 143, 83, 0.06) 0%, rgba(233, 143, 83, 0) 100%)",
                          fontFamily: "var(-s-font-nunito-sans), sans-serif",
                          fontWeight: 400,
                        }}
                        onClick={() => setEditingTags(!editingTags)}
                        data-glow="true"
                      >
                        {editingTags ? "done" : "edit tags"}
                      </button>
                    </div>
                </div>

                {/* Panel to manage all tags */}
                {editingTags && tagsShown && (
                  <div
                    className="absolute left-0 mt-2 p-4 rounded z-10"
                    style={{ width: "100%", top: "100%" }}
                  >
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => {
                        const alreadyAdded = entryTags.some((et) => et.tag_id === tag.tag_id);
                        return (
                          <div
                            key={tag.tag_id}
                            className={`flex items-center px-4 py-1 rounded-full cursor-pointer border-1 transition duration-300 ease-in-out hover:scale-105 ${
                              alreadyAdded
                                ? "text-[#bb99ff] hover:text-[#996af6]"
                                : "text-gray-600 hover:text-gray-700"
                            }`}
                            onClick={() => {
                              if (!alreadyAdded) handleAddTagToEntry(tag.tag_id);
                            }}
                          >
                            <span>{tag.name}</span>
                            {/* Delete button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // prevents triggering the add
                                if (
                                  window.confirm(
                                    `Delete tag "${tag.name}" from the database? This will remove it from all entries.`
                                  )
                                ) {
                                  handleDeleteTagFromDB(tag.tag_id);
                                }
                              }}
                              className="ml-2 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          {/* save/edit */}
          {isEditable ? (
            <>
              {hasText && (
                <button
                  className="relative overflow-hidden transition duration-300 ease-in-out hover:scale-105 text-[#E98F53]"
                  style={{
                    padding: "4.4px 19.41px 4.81px 20px",
                    borderRadius: "36px",
                    border: "1px solid #E98F53",
                    background:
                      "linear-gradient(180deg, rgba(233, 143, 83, 0.06) 0%, rgba(233, 143, 83, 0) 100%)",
                    fontFamily: "var(--font-nunito-sans), sans-serif",
                    fontWeight: 400,
                  }}
                  onClick={handleSave}
                  data-glow="true"
                >
                  save
                </button>
              )}
            </>
          ) : (
            <>
              <button
                className="relative overflow-hidden transition duration-300 ease-in-out hover:scale-105 text-[#E98F53]"
                style={{
                  padding: "4.4px 19.41px 4.81px 20px",
                  borderRadius: "36px",
                  border: "1px solid #E98F53",
                  background:
                    "linear-gradient(180deg, rgba(233, 143, 83, 0.06) 0%, rgba(233, 143, 83, 0) 100%)",
                  fontFamily: "var(--font-nunito-sans), sans-serif",
                  fontWeight: 400,
                }}
                onClick={handleEdit}
                data-glow="true"
              >
                edit
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
