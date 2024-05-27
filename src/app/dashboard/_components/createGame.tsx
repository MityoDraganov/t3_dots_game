import { Input } from "~/components/ui/input";

export default function createGame({
  option,
}: {
  option: "singleplayer" | "versus" | "multiplayer";
}) {
  return (
    <div className="w-full md:w-1/3 m-auto p-4">
      <Input />
    </div>
  );
}
