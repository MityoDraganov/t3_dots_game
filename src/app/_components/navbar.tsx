"use client";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import Link from "next/link";

export default function NavBar() {
  const { user } = useUser();

  return (
    <div className="flex justify-between p-5 text-white">
      <div>
        <Link href="/leaderboard">Leaderboard</Link>
      </div>
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <UserButton />
      </div>
    </div>
  );
}
