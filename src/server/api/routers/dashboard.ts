import { any, z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { PrismaClient } from "@prisma/client";
import pusher from "~/server/utils/pusher";

const prisma = new PrismaClient();

async function createLobbyWithAuthor(authorId: string, title?: string) {
  const lobby = await prisma.lobby.create({
    data: {
      authorId,
      title,
    },
  });

  // Trigger Pusher event
  pusher.trigger("lobby-channel", "lobby-created", {
    lobbyId: lobby.id,
    authorId: lobby.authorId,
    createdAt: lobby.createdAt,
  });

  return lobby;
}

async function joinLobby(userId: string, lobbyId: string) {
  const lobby = await prisma.lobby.findUnique({
    where: { id: lobbyId },
  });

  if (!lobby) {
    throw new Error("Lobby not found");
  }

  if (lobby.playerId) {
    throw new Error("Lobby is already full");
  }

  const updatedLobby = await prisma.lobby.update({
    where: { id: lobbyId },
    data: {
      playerId: userId,
    },
  });

  // Trigger Pusher event
  pusher.trigger("lobby-channel", "player-joined", {
    lobbyId: updatedLobby.id,
    playerId: updatedLobby.playerId,
  });

  return updatedLobby;
}

export const dashboardRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await prisma.lobby.findMany();
  }),

  create: protectedProcedure
    .input(any())
    .mutation(async ({ ctx, input }) => {
  
      console.log("Received title:", input);

      // Your logic here
      return { success: true };
    }),

    
  join: publicProcedure
    .input(any())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      const { lobbyId } = input;

      if (!userId) {
        throw new Error("User auth required!");
      }

      return await joinLobby(userId, lobbyId).catch((e) => {
        console.error(e);
        throw new Error("Failed to join lobby");
      });
    }),
});
