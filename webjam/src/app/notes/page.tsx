import Link from "next/link";
import StickyNote from "./stickynote";
import { redirect } from "next/navigation";

export default async function NotesPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/get_all_entries`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  if (res.status == 401) {
    redirect("/login")
  }

  const data = await res.json();
  
  const notes = data.body ?? [];
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
