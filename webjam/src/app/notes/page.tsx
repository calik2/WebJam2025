"use client";

import Link from "next/link";
import StickyNote from "./stickynote";
import { useState, useEffect } from "react";

export default function NotesPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const [notes, setNotes] = useState<any[]>([]);

  const getNotes = async () => {
    const res = await fetch(`${baseUrl}/api/get_all_entries`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const data = await res.json();
    setNotes(data.body)
  } 
  useEffect(() => {
      getNotes()
  }, [])

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
        {/* Simple navigation links, need to make it look nice */}
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
                background: "#C0BDBD",
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
          <li>
            <Link
              href="/learn"
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
              Learn
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex p-8 ">
        <h1 className="text-3xl font-semibold">Your Notes of Learning</h1>
      </div>
      <div className="columns-4 sm:columns-2 lg:columns-4 gap-6 p-10">
        {notes.map((note, index) => (
          <StickyNote key={index} date={note.date} content={note.description} />
        ))}
      </div>
    </>
  );
}
