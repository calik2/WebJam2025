"use client";
import { login, signup } from "./actions";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen items-center justify-center ">
        <div className="text-4xl font-semibold font-[--font-sans] text-center text-[#353D48] mb-10 ">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Welcome, ready to knowledge dump?
          </motion.h1>
        </div>
        <form className="flex flex-col space-y-4 p-8 rounded-2xl shadow-lg w-full max-w-sm">
          <label htmlFor="email" className="text-gray-700 font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label htmlFor="password" className="text-gray-700 font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex justify-between mt-4">
            <button
              formAction={login}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 duration-300 ease-in-out hover:scale-105 transition"
            >
              Log in
            </button>
            <button
              formAction={signup}
              className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 duration-300 ease-in-out hover:scale-105 transition"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
