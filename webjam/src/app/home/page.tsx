"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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
                background: "#F8E1BF",
                boxShadow: "0 3px 8px rgba(0, 0, 0, 0.06)",
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
              className="inline-block text-[#353D48] text-lg font-semibold font-sans text-center rounded-lg transition duration-300 ease-in-out hover:opacity-80 hover:scale-105"
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
              className="inline-block text-[#353D48] text-lg font-semibold font-sans text-center rounded-lg transition duration-300 ease-in-out hover:opacity-80 hover:scale-105"
            >
              Notes
            </Link>
          </li>
        </ul>
      </nav>
      {/* want this to be properly centered, also want the date above the  */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <HeaderAndBody />
      </motion.div>
    </div>
  );
}
