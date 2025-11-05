"use client";
import Link from "next/link";
import { useState } from "react";

export default function Homepage() {
  const [entry, setEntry] = useState<string>("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Entry submitted:", entry);
    setEntry("");
  };
  return (
    <>
      <nav className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4 text-xl">
        {/* Simple navigation links, need to make it look nice */}
        <Link href="/home">Home</Link> <Link href="/notes">Notes Page</Link>
      </nav>
      <div className="flex  items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
          Welcome to the Homepage!
        </h1>
      </div>
      <div className="m-4 flex items-center justify-center">
        {/* simple input form, want it to look like a notebook and maybe not be a form */}
        <form onSubmit={handleSubmit}>
          <input
            className="mr-2 input input-bordered bg-pink-500 dark:bg-black text-black dark:text-white"
            type="text"
            value={entry}
            placeholder="What did you learn today..."
            onChange={(e) => setEntry(e.target.value)}
          />
          <br></br>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
