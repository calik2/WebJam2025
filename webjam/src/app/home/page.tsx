"use client";

import Link from "next/link";

import PaperTiptap from "./texteditor";

export default function Homepage() {
  // Load from localStorage on mount
  const date = new Date();

  return (
    <>
      <nav className="flex items-center justify-end bg-zinc-50 var(--font-sans) dark:bg-black p-4 text-xl">
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
      <div className="text-center p-4 my-8 text-2xl font-semibold font-[var(--font-lora)] dark:bg-black">
        {date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      <div className=" justify-center items-center">
        <PaperTiptap />
      </div>
    </>
  );
}
