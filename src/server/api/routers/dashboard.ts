import { clerkClient } from "@clerk/nextjs/server";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createLobbyWithAuthor(authorId: string) {
  const lobby = await prisma.lobby.create({
    data: {
      authorId, // Assuming your Prisma schema has a userId field in the Lobby model
    },
  });

  return lobby;
}

export const dashboardRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ctx}) => {
    return await ctx.db.lobby.findMany()
  }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const gameLobby = await createLobbyWithAuthor(userId)
      .catch((e) => console.error(e))
      .finally(async () => {
        await prisma.$disconnect();
      });

    return gameLobby;
  }),

  join:
});
