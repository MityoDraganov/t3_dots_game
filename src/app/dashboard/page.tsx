"use client";

import "~/styles/globals.css";

import CreateGame from "./_components/createGame";
import { useSearchParams } from 'next/navigation';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const search = searchParams.get('option');

  if (!search || !["singleplayer", "versus", "multiplayer"].includes(search)) {
    return null;
  }

  return (
    <div>
       <CreateGame option={search as "singleplayer" | "versus" | "multiplayer"} />
    </div>
  );
}
