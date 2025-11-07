"use client";

import Link from "next/link";

import HeaderAndBody from "./texteditor";

export default function Homepage() {
  // Load from localStorage on mount

  return (
    <div className="min-h-screen">
      <nav
        className="font-[var(--font-sans)] text-xl bg-transparent"
        style={{
          position: "fixed",
          right: "0px",
          top: "0px",
          display: "inline-flex",
          padding: "15px 130.61px 2px 173.44px",
          justifyContent: "flex-end",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {/* Simple navigation links, need to make it look nice */}
        <ul className="flex space-x-8">
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
                background: "#C0BDBD",
              }}
            ></div>
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
          <li>
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
      {/* want this to be properly centered, also want the date above the  */}
      <div>
        <HeaderAndBody />
      </div>
    </div>
  );
}
