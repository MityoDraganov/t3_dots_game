import { CreatePost } from "~/app/_components/create-post";
import Link from "next/link";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-[10%]">
      <div className="grid h-1/2 w-full grid-cols-3 gap-[5%]  text-center">
      <Link href={{ pathname: '/dashboard', query: { option: 'singleplayer' } }}>
          <div className="group flex h-full flex-col gap-6 rounded-xl border-2 border-slate-200 p-4 text-slate-50">
            <h2 className="text-3xl font-bold opacity-80 group-hover:opacity-100">
              Play vs Bot
            </h2>
          </div>
        </Link>

        <Link href={{ pathname: '/dashboard', query: { option: 'versus' } }}>
          <div className="group flex h-full flex-col gap-6 rounded-xl border-2 border-slate-200 p-4 text-slate-50">
            <h2 className="text-3xl font-bold opacity-80 group-hover:opacity-100">
              Play vs Player
            </h2>
            <p className="mx-auto w-1/2 text-xl opacity-60 group-hover:opacity-100">
              Play with 2 players on a single computer.
            </p>
          </div>
        </Link>

        <Link href={{ pathname: '/dashboard', query: { option: 'multiplayer' } }}>
          <div className="group flex h-full flex-col gap-6 rounded-xl border-2 border-slate-200 p-4 text-slate-50">
            <h2 className="text-3xl font-bold opacity-80 group-hover:opacity-100">
              Play vs Player
            </h2>
            <p className="mx-auto w-1/2 text-xl opacity-60 group-hover:opacity-100">
              Play with 2 players on seperate computers over the internet.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
