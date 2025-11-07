import Link from "next/link";
import StickyNote from "./stickynote";
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
  notes ?? []
  return notes
}

export default async function NotesPage() {
  const notes = await fetch_data()
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
        {notes!.map((note, index) => (
          <StickyNote key={index} date={note.date} content={note.description} />
        ))}
      </div>
    </>
  );
}
