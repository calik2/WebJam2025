"use client";

import Link from "next/link";

import PaperTiptap from "./texteditor";

export default function Homepage() {
  // Load from localStorage on mount

  return (
    <>
      <nav className="flex items-center justify-end font-[var(--font-sans)] p-4 text-xl">
        {/* Simple navigation links, need to make it look nice */}
        <ul className="flex space-x-4">
          <li>
            <Link href="/home">Home</Link>
          </li>
          <li>
            <Link href="/notes">Notes Page</Link>
          </li>
        </ul>
      </nav>
      {/* want this to be properly centered, also want the date above the  */}

      <div>
        <PaperTiptap />
      </div>
    </>
  );
}
