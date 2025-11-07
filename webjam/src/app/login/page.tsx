"use client";
import { login, signup } from "./actions";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LoginPage() {
  const [isLogInClicked, setIsLogInClicked] = useState(false);
  return (
    <>
      <div
        className="flex flex-col min-h-screen items-center justify-center px-4"
        style={{
          background:
            "radial-gradient(40% 40% at 50% 65%, rgba(255, 202, 170, 0.4) 0%, rgba(236, 195, 212, 0.3) 30%, rgba(163, 189, 255, 0.25) 55%, rgba(123, 153, 221, 0.45) 75%, rgba(103, 136, 210, 0.65) 100%)",
          backgroundColor: "#7f9fce",
        }}
      >
        <div className="relative inline-block mb-10 px-6 py-3" style={{ marginTop: "-40px" }}>
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(30, 58, 138, 0.25) 0%, rgba(15, 23, 42, 0.2) 100%)",
              opacity: 0.2,
              filter: "blur(10px) contrast(1.2) brightness(0.9)",
            }}
          ></div>
          <div
            className="absolute inset-0 rounded-lg opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              filter: "blur(8px)",
            }}
          ></div>
          <div
            className="relative text-4xl italic text-center text-white hover-glow-title"
            style={{
              fontFamily: "var(--font-lora), serif",
              fontWeight: 400,
              lineHeight: "normal",
              letterSpacing: "0px",
              transform: "skewX(5deg)",
              fontFeatureSettings: '"liga" 1, "calt" 1, "clig" 1',
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
            What did I learn today?
            </motion.h1>
          </div>
        </div>
        <form
          className="flex flex-col space-y-4 rounded-2xl shadow-lg w-full"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "40px 48px",
            maxWidth: "480px",
          }}
        >
          <label
            htmlFor="email"
            className="text-gray-700 font-medium"
            style={{
              fontFamily: "var(--font-nunito-sans), sans-serif",
              fontSize: "20px",
            }}
          >
            email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              fontFamily: "var(--font-nunito-sans), sans-serif",
            }}
          />

          <label
            htmlFor="password"
            className="text-gray-700 font-medium"
            style={{
              fontFamily: "var(--font-nunito-sans), sans-serif",
              fontSize: "20px",
            }}
          >
            password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              fontFamily: "var(--font-nunito-sans), sans-serif",
            }}
          />

          <div className="flex justify-between mt-4">
            <button
              formAction={login}
              onMouseDown={() => setIsLogInClicked(true)}
              onMouseUp={() => setIsLogInClicked(false)}
              onMouseLeave={() => setIsLogInClicked(false)}
              className="login-button"
              style={{
                borderRadius: "36px",
                background: "#6F90D1",
                display: "inline-flex",
                padding: "4.4px 19.41px 4.81px 20px",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontFamily: "var(--font-nunito-sans), sans-serif",
                fontSize: "20px",
                border: "none",
                cursor: "pointer",
                transition: "box-shadow 0.2s ease",
                boxShadow: isLogInClicked ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "none",
              }}
            >
              Log in
            </button>
            <button
              formAction={signup}
              className="signup-button"
              style={{
                borderRadius: "36px",
                background: "#6F90D1",
                display: "inline-flex",
                padding: "4.4px 19.41px 4.81px 20px",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontFamily: "var(--font-nunito-sans), sans-serif",
                fontSize: "20px",
                border: "none",
                cursor: "pointer",
                transition: "box-shadow 0.2s ease",
              }}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
