 "server-only";

import { PrismaClient } from "@prisma/client";
import { cache } from "react";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { headers } from "next/headers";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  // Initialize PrismaClient
  const prisma = new PrismaClient();

  return Promise.resolve({
    headers: heads,
    db: prisma,
    session: null, // Replace null with your Session or null if not available
  });
});

export const api = createCaller(createContext);
