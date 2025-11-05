import Link from "next/link";

export default function NotesPage() {
  return (
    <>
      <nav>
        {/* Simple navigation links, need to make it look nice */}
        <Link href="/home">Home</Link> | <Link href="/notes">Notes Page</Link>
      </nav>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
          Welcome to the Notes Page!
        </h1>
      </div>
    </>
  );
}
