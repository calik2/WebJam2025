"use client";

import Link from "next/link";

import PaperTiptap from "./texteditor";

export default function Homepage() {
  // Load from localStorage on mount

  return (
    <>
      <nav className="flex items-center justify-center bg-zinc-50 var(--font-sans) dark:bg-black p-4 text-xl">
        {/* Simple navigation links, need to make it look nice */}
        <Link href="/home">Home</Link> <Link href="/notes">Notes Page</Link>
      </nav>
      {/* want this to be properly centered */}
      <div className="flex min-h-screen justify-center items-center">
        <PaperTiptap />
      </div>
    </>
  );
}
