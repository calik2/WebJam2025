import Link from "next/link";
import StickyNote from "./stickynote";

export default function NotesPage() {
  const fake_data = [
    {
      date: 1,
      header: "Human Bones",
      content:
        "Babies are born with 275 to 300 bones. By the time they're adults, they only have 206 since some bones fuse together as they grow. Babies are born with 275 to 300 bones. By the time they're adults, they only have 206 since some bones fuse together as they grow. Babies are born with 275 to 300 bones. By the time they're adults, they only have 206 since some bones fuse together as they grow. Babies are born with 275 to 300 bones. By the time they're adults, they only have 206 since some bones fuse together as they grow.",
    },
    {
      date: 2,
      header: "Ferret Legging",
      content:
        "Ferret-legging is a endurance sport in which competitors attempt to keep ferrets trapped in their pants for as long as possible.",
    },
    {
      date: 3,
      header: "Jaws Quote",
      content:
        "Actor Roy Scheider improvised the famous “Jaws” quote, “You’re gonna need a bigger boat.”",
    },
    {
      date: 4,
      header: "Human Bones",
      content:
        "Babies are born with 275 to 300 bones. By the time they're adults, they only have 206 since some bones fuse together as they grow. Babies are born with 275 to 300 bones. By the time they're adults, they only have 206 since some bones fuse together as they grow. Babies are born with 275 to 300 bones. By the time they're adults, they only have 206 since some bones fuse together as they grow. Babies are born with 275 to 300 bones. By the time they're adults, they only have 206 since some bones fuse together as they grow.",
    },
    {
      date: 5,
      header: "Ferret Legging",
      content:
        "Ferret-legging is a endurance sport in which competitors attempt to keep ferrets trapped in their pants for as long as possible.",
    },
    {
      date: 6,
      header: "Jaws Quote",
      content:
        "Actor Roy Scheider improvised the famous “Jaws” quote, “You’re gonna need a bigger boat.”",
    },
  ];
  return (
    <>
      <nav
        className="font-[var(--font-sans)] text-xl"
        style={{
          position: "absolute",
          right: "0px",
          top: "0px",
          display: "inline-flex",
          padding: "15px 130.61px 2px 173.44px",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {/* Simple navigation links, need to make it look nice */}
        <ul className="flex space-x-8">
          <li>
            <Link
              href="/home"
              style={{
                color: "#353D48",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: "19px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "19px",
              }}
            >
              Home
            </Link>
          </li>
          <li style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: "-55px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100px",
                height: "45px",
                flexShrink: 0,
                borderRadius: "30px",
                background: "#F8E1BF",
              }}
            ></div>
            <Link
              href="/notes"
              style={{
                color: "#353D48",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: "19px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "19px",
              }}
            >
              Notes
            </Link>
          </li>
          <li>
            <Link
              href="/learn"
              style={{
                color: "#353D48",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: "19px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "19px",
              }}
            >
              Learn
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex p-8 ">
        <h1 className="text-3xl font-semibold">Your Notes of Learning</h1>
      </div>
      <div className="columns-4 sm:columns-2 lg:columns-4 gap-6 p-10">
        {fake_data.map((note, index) => (
          <StickyNote
            key={index}
            date={note.date}
            content={note.content}
            header={note.header}
          />
        ))}
      </div>
    </>
  );
}
