"use client";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import Link from "next/link";

export default function Footer() {


  return (
    <footer className="text-slate-200 absolute bottom-0 right-0 p-2">
    <p>&copy; 2024 The Dots Game. All rights reserved.</p>
  </footer>
  );
}
