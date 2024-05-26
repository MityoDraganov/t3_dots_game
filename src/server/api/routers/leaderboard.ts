
import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const leaderboardRouter = createTRPCRouter({
  getAllUsers: publicProcedure
    .query(({ctx}) => {
      return null;
      //return clerkClient.users.getUserList();
    }),
});
