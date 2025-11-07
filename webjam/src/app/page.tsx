import Image from "next/image";
import Homepage from "./home/page";
import NotesPage from "@/app/notes/page";
import Link from "next/link";
import { redirect } from "next/navigation";

// with time, make a sign in page here before homepage
// need to make this look nice
export default function SignIn() {
  redirect('/login')
  // return <p>Hi</p>
}
