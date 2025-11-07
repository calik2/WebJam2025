"use client";

import Link from "next/link";
import StickyNote from "./stickynote";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function NotesPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const [notes, setNotes] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<{ tag_id: number; name: string }[]>([]);
  const [tagsMap, setTagsMap] = useState<{ [id: number]: string }>({});
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getNotes = async () => {
    const resEntries = await fetch(`${baseUrl}/api/get_all_entries`);
    const dataEntries = await resEntries.json();
    const entriesData = dataEntries.body || [];

    const resAllTags = await fetch(`${baseUrl}/api/tags/get_all_tags`);
    const dataAllTags = (await resAllTags.json()).body || [];
    setAllTags(dataAllTags);

    const map: { [id: number]: string } = {};
    dataAllTags.forEach((tag) => {
      map[tag.tag_id] = tag.name;
    });
    setTagsMap(map);

    const entriesWithTags = await Promise.all(
      entriesData.map(async (entry: any) => {
        const resTags = await fetch(
          `${baseUrl}/api/entry_tags/get_entry_tag?entry_id=${entry.entry_id}`
        );
        const tagsData = await resTags.json();
        const tagList = tagsData.body || [];
        return {
          ...entry,
          tags: tagList,
          tagNames: tagList.map((t: { tag_id: number }) => map[t.tag_id]),
        };
      })
    );

    setNotes(entriesWithTags);
  };

  useEffect(() => {
    getNotes();
  }, []);

  // Filter notes by selected tag and search query
  const filteredNotes = notes.filter((note) => {
    const matchesTag = selectedTag ? note.tagNames?.includes(selectedTag) : true;
    const matchesSearch =
      searchQuery === "" ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <>
      <nav
        className="font-[var(--font-sans)] text-xl"
        style={{
          position: "absolute",
          right: "0px",
          top: "0px",
          display: "inline-flex",
          padding: "15px 130.61px 2px 173.44px",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <ul className="flex space-x-8">
          <li>
            <Link
              href="/home"
              style={{
                color: "#353D48",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: "19px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "19px",
              }}
            >
              Home
            </Link>
          </li>
          <li style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: "-55px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100px",
                height: "45px",
                flexShrink: 0,
                borderRadius: "30px",
                background: "#F8E1BF",
                boxShadow: "0 3px 8px rgba(0, 0, 0, 0.06)",
              }}
            ></div>
            <Link
              href="/notes"
              style={{
                color: "#353D48",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: "19px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "19px",
              }}
            >
              Notes
            </Link>
          </li>
        </ul>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="pb-40" // padding-bottom so content isn't hidden behind tag bar
      >
        <div style={{ height: "90px" }}></div>

        {/* Sticky notes layout */}
        <div
          className="columns-4 sm:columns-2 lg:columns-4 p-10"
          style={{ columnGap: "15px" }}
        >
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note, index) => (
              <StickyNote
                key={note.entry_id ?? index}
                index={index}
                date={note.date}
                content={note.description.slice(0, 150)}
                header={note.title}
                tags={note.tagNames}
              />
            ))
          ) : (
            <div className="text-gray-500 italic">No notes found</div>
          )}
        </div>
      </motion.div>

      {/* Fixed bottom tag bar */}
      <div className="fixed bottom-0 right-4 flex flex-col gap-2 z-50 p-4">
        {/* Search bar */}
        <div className="flex justify-end w-full">
          <input
            type="text"
            placeholder="Search by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input rounded-full px-4 py-2 w-64 focus:outline-none focus:border-[#E48ABF]"
            style={{ 
              fontFamily: "var(--font-nunito-sans), sans-serif",
              border: "1px solid #9CA3AF",
              color: "#111827"
            }}
          />
        </div>
        {/* "All" bubble */}
        <div className="flex flex-wrap gap-2 justify-center mt-2">
        <div
          className={`px-4 py-1 rounded-full border cursor-pointer text-sm transition ${
            selectedTag === null
              ? "text-white border-[#E48ABF]"
              : "text-[#E48ABF] border-[#E48ABF]"
          }`}
          onClick={() => setSelectedTag(null)}
          style={{ 
            fontFamily: "var(--font-nunito-sans), sans-serif",
            backgroundColor: selectedTag === null 
              ? "rgba(228, 138, 191, 0.5)" 
              : "rgba(255, 255, 255, 0.5)"
          }}
        >
          all tags
        </div>

        {/* Tag bubbles */}
        {allTags.map((tag) => {
          // Hide tags that aren't selected when a tag is selected
          if (selectedTag !== null && selectedTag !== tag.name) {
            return null;
          }
          return (
            <div
              key={tag.tag_id}
              className="px-4 py-1 rounded-full border-1 cursor-pointer text-sm transition"
              onClick={() => setSelectedTag(tag.name)}
              style={{ 
                fontFamily: "var(--font-nunito-sans), sans-serif",
                color: "#9CA3AF",
                borderColor: "#9CA3AF"
              }}
            >
              {tag.name}
            </div>
          );
        })}
        </div>
      </div>
    </>
  );
}