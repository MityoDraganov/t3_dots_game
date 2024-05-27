"use client";

import "~/styles/globals.css";

import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Lock, LockOpen } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { Button } from "~/components/ui/button";
import { InputGroup } from "./_components/inputGroup";
import { Label } from "~/components/ui/label";
import Link from "next/link";
import { api } from "~/trpc/react";
import useFormData from "./hooks/useForm";

export default function Home() {
  const [formData, handleInputChange] = useFormData<{
    code: string;
    title: string;
  }>({
    code: "",
    title: "",
  });

  const createMutation = api.dashboard.create.useMutation({
    onError: (e: any) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        console.error(errorMessage[0]);
      } else {
        console.error("Failed to post! Please try again later.");
      }
    },
  });


  const joinGameHandler = (e: React.FormEvent<HTMLFormElement>) => {};

  const createGameHandler = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    try {
      const { title } = formData; // Destructure title from formData
      const result = await createMutation.mutateAsync({title: "kur"})
      console.log(result);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };
  

  return (
    <div className="flex h-full w-full flex-col items-center gap-[10%] px-[10%] pt-[5%]">
      <h2 className="flex items-center justify-center gap-2 text-3xl font-bold tracking-widest text-slate-50">
        The
        <span className="flex items-center justify-center rounded-md bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 px-4 py-1">
          Dots
        </span>
        game .
      </h2>
      <div className="flex h-full w-full flex-col items-center">
        <div className="grid h-2/3 w-full grid-cols-3 gap-[5%] text-center">
          <Link
            href={{ pathname: "/dashboard", query: { option: "singleplayer" } }}
          >
            <div className="group flex h-full flex-col gap-6 rounded-xl border-2 border-slate-200 p-4 text-slate-50">
              <h2 className="text-3xl font-bold opacity-80 group-hover:opacity-100">
                Play vs Bot
              </h2>
              <p className="mx-auto w-1/2 text-xl opacity-60 group-hover:opacity-100">
                Play vs Ai powered bot.
              </p>
            </div>
          </Link>

          <Link href={{ pathname: "/dashboard", query: { option: "versus" } }}>
            <div className="group flex h-full flex-col gap-6 rounded-xl border-2 border-slate-200 p-4 text-slate-50">
              <h2 className="text-3xl font-bold opacity-80 group-hover:opacity-100">
                Play vs Player
              </h2>
              <p className="mx-auto w-1/2 text-xl opacity-60 group-hover:opacity-100">
                Play with 2 players on a single computer.
              </p>
            </div>
          </Link>

          <Dialog>
            <DialogTrigger>
              <div className="group flex h-full flex-col gap-6 rounded-xl border-2 border-slate-200 p-4 text-slate-50">
                <h2 className="text-3xl font-bold opacity-80 group-hover:opacity-100">
                  Play vs Player
                </h2>
                <p className="mx-auto w-1/2 text-xl opacity-60 group-hover:opacity-100">
                  Play with 2 players on separate computers over the internet.
                </p>
              </div>
            </DialogTrigger>
            <DialogContent className="h-1/2 select-none p-10">
              <Tabs defaultValue="create" className="flex flex-col gap-4">
                <TabsList className="w-full">
                  <TabsTrigger
                    className="w-1/3 active:bg-slate-800"
                    value="join"
                  >
                    Join game
                  </TabsTrigger>
                  <TabsTrigger className="w-2/3" value="create">
                    Create game
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="join">
                  <form className="flex flex-col gap-4">
                    <InputGroup
                      id="code"
                      label="Enter game's code:"
                      placeHolder="Enter code here"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="font-semibold"
                    />
                    <Button className="mx-auto w-2/3">Join</Button>
                  </form>
                </TabsContent>
                <TabsContent value="create">
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={createGameHandler}
                  >
                    <InputGroup
                      id="title"
                      label="Title:"
                      placeHolder="Enter title here"
                      value={formData.title}
                      onChange={handleInputChange}
                    />

                    <div className="flex flex-col gap-2">
                      <h2 className="font-semibold">Privacy</h2>
                      <RadioGroup defaultValue="option-one">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option-one" id="option-one" />
                          <Label
                            htmlFor="option-one"
                            className="flex items-center gap-2"
                          >
                            Public lobby <LockOpen />
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option-two" id="option-two" />
                          <Label
                            htmlFor="option-two"
                            className="flex items-center gap-2"
                          >
                            Private lobby <Lock />
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button className="mx-auto w-2/3">Create</Button>
                  </form>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
