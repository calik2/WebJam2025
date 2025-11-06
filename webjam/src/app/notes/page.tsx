import Link from "next/link";
import StickyNote from "./stickynote";

export default function NotesPage() {
  const fake_data = [
    {
      date: 1,
      content:
        "Babies are born with 275 to 300 bones. By the time they're adults, they only have 206 since some bones fuse together as they grow. Babies are born with 275 to 300 bones. By the time they're adults, they only have 206 since some bones fuse together as they grow. Babies are born with 275 to 300 bones. By the time they're adults, they only have 206 since some bones fuse together as they grow. Babies are born with 275 to 300 bones. By the time they're adults, they only have 206 since some bones fuse together as they grow.",
    },
    {
      date: 2,
      content:
        "Ferret-legging is a endurance sport in which competitors attempt to keep ferrets trapped in their pants for as long as possible.",
    },
    {
      date: 3,
      content:
        "Actor Roy Scheider improvised the famous “Jaws” quote, “You’re gonna need a bigger boat.”",
    },
    {
      date: 4,
      content:
        "Babies are born with 275 to 300 bones. By the time they're adults, they only have 206 since some bones fuse together as they grow. Babies are born with 275 to 300 bones. By the time they're adults, they only have 206 since some bones fuse together as they grow. Babies are born with 275 to 300 bones. By the time they're adults, they only have 206 since some bones fuse together as they grow. Babies are born with 275 to 300 bones. By the time they're adults, they only have 206 since some bones fuse together as they grow.",
    },
    {
      date: 5,
      content:
        "Ferret-legging is a endurance sport in which competitors attempt to keep ferrets trapped in their pants for as long as possible.",
    },
    {
      date: 6,
      content:
        "Actor Roy Scheider improvised the famous “Jaws” quote, “You’re gonna need a bigger boat.”",
    },
  ];
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
        {fake_data.map((note, index) => (
          <StickyNote key={index} date={note.date} content={note.content} />
        ))}
      </div>
    </>
  );
}
