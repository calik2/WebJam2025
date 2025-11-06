import Link from "next/link";
import StickyNote from "./stickynote";

export default function NotesPage() {
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

      <StickyNote />
    </>
  );
}
