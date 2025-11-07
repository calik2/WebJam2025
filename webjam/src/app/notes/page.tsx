"use client";

import Link from "next/link";
import StickyNote from "./stickynote";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { createClient } from '@/utils/supabase/server'

async function fetch_data() {
  const supabase = await createClient()
  const { data, error: auth_error } = await supabase.auth.getUser()
  
  if (auth_error || !data?.user) {
    console.log(data)
    redirect("/login")
  }
  
  let query = supabase
      .from("entries")
      .select()
      .eq('uid', data.user.id);

  const { data: notes } = await query
  return notes
}

export default function NotesPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const [notes, setNotes] = useState<any[]>([]);

  const getNotes = async () => {
    const data = await fetch_data() ?? []
    setNotes(data);
  };
  useEffect(() => {
    getNotes();
  }, []);

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
        </ul>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="flex p-8 ">
          <h1 className="text-3xl font-semibold">Your Notes of Learning</h1>
        </div>
        <div className="columns-4 sm:columns-2 lg:columns-4 gap-6 p-10">
          {notes.map((note, index) => (
            <StickyNote
              key={note.id ?? index}
              date={note.date}
              content={note.description}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </>
  );
}
