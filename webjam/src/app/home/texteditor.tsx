"use client";

// note: most of this is from chat, but i can change it i think

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import Tag from "./tag";

export default function HeaderAndBody() {
  const date = new Date();
  const uidHardcoded = "b713dfe0-ed34-4a45-8681-bbbb1dadc662";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const [isEditable, setIsEditable] = useState(true);
  const [tagsShown, setTagsShown] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
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

  // const [labels, setLabels] = useState<string[]>(() => {
  //   if (typeof window !== "undefined") {
  //     return JSON.parse(localStorage.getItem("labels") || "[]");
  //   }
  //   return [];
  // });

  const [newTag, setNewTag] = useState("");
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

  useEffect(() => {
    if (bodyeditor && entry.description) {
      bodyeditor.commands.setContent(entry.description);
    }
    if (headereditor && entry.title) {
      headereditor.commands.setContent(entry.title);
    }
  }, [entry, bodyeditor, headereditor]);

  const handleSave = async () => {
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
      if (headereditor) headereditor.view.dom.style.color = "#353D48";
      if (headereditor) headereditor.view.dom.style.fontSize = "30px";
      console.log("Saved content:", content);

      if (entry.entry_id) {
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

      // TODO: IF IT DIDN'T SAVE -> DISPLAY SOME KIND OF MESSAGE
      // TODO: NEED TO UPDATE SO THAT AFTER LEAVING HOME AND GOING TO NOTES, IF A NOTE WAS SAVED WE WANT TO SHOW EDIT NOT JUST SAVE
    }
  };

  const handleEdit = async () => {
    if (bodyeditor) {
      const content = bodyeditor.getHTML();

      setIsEditable(true); // unlock editor
      console.log("edit content:", content);
      setIsEdit(true);
      setTagsShown(false);
      bodyeditor.view.dom.style.color = "#77777B";
      bodyeditor.view.dom.style.fontSize = "30px";
    }

    if (headereditor) headereditor.view.dom.style.color = "#77777B";
    if (headereditor) headereditor.view.dom.style.fontSize = "25px";
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
      body: JSON.stringify({ uid: uidHardcoded, tag_id }),
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
    
    {console.log(allTags)}
      <div className="flex flex-col justify-center items-start min-h-screen px-8 py-4 space-y-6 rounded-lg max-w-4xl mx-auto my-10 bg-transparent">
        <div className="text-xl text-[#A5A5A3] font-semibold font-[var(--font-sans)]">
          {date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          <div className="font-normal font-[var(--font-sans)] ">
            <EditorContent editor={bodyeditor} />
          </div>
        </div>

        <div className="flex justify-between items-end space-y-4 w-full max-w-4xl p-4 text-xl">
          {isEditable ? (
            <>
              <button
                className="px-4 py-2 rounded-4xl outline outline-solid hover:outline-2 duration-300 ease-in-out hover:scale-105 transition"
                onClick={handleSave}
              >
                save
              </button>
            </>
          ) : (
            <>
              <button
                className="px-4 py-2 rounded-4xl outline outline-solid hover:outline-2 duration-300 ease-in-out hover:scale-105 transition"
                onClick={handleEdit}
              >
                edit
              </button>
            </>
          )}
          <div className=" flex-1 px-8 text-right">
            {tagsShown && (
              <div className="flex flex-col space-y-3 mt-4">
                {/* Current tags for this entry */}
                <div className="flex flex-wrap gap-2">
                  {entryTags.length > 0 ? (
                    entryTags.map((tag) => (
                      <div
                        key={tag.tag_id}
                        className="flex items-center bg-gray-100 px-3 py-1 rounded"
                      >
                        <span>{tagsMap[tag.tag_id]}</span>
                        {editingTags && (
                          <button
                            onClick={() => handleRemoveTagFromEntry(tag.tag_id)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            -
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500 italic">No tags yet</span>
                  )}
                  <button
                    onClick={() => setEditingTags(!editingTags)}
                    className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    {editingTags ? "Done" : "Edit"}
                  </button>
                </div>

                {/* Panel to manage all tags */}
                {editingTags && tagsShown && (
                  <div className="flex flex-col space-y-2 mt-2 p-2 border rounded bg-gray-50">
                    {/* Add new tag */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="New tag..."
                        className="border rounded px-3 py-1 flex-1"
                      />
                      <button
                        onClick={handleAddNewTag}
                        className="px-3 py-1 bg-green-200 rounded hover:bg-green-300"
                      >
                        Add
                      </button>
                    </div>

                    {/* Add existing tag to today’s entry */}
                    <div className="flex flex-wrap gap-2">
                      {allTags
                        .filter(
                          (t) => !entryTags.some((et) => et.tag_id === t.tag_id)
                        )
                        .map((tag) => (
                          <button
                            key={tag.tag_id}
                            onClick={() => handleAddTagToEntry(tag.tag_id)}
                            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                          >
                            + {tag.name}
                          </button>
                        ))}
                    </div>

                  {/* Add existing tag to today’s entry */}
                  <div className="flex flex-wrap gap-2">
                    {allTags.filter(
                        (t) =>t && t.tag_id && !entryTags.some((et) => et && et.tag_id && et.tag_id === t.tag_id)
                      )
                      .map((tag) => (
                        <button
                          key={tag.tag_id}
                          onClick={() => handleDeleteTagFromDB(tag.tag_id)}
                          className="bg-red-200 px-3 py-1 rounded hover:bg-red-300"
                        >
                          Delete {tag.name}
                        </button>
                      ))}
                    </div>
                  </div>
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
