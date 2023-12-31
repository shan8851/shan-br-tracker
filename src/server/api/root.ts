import { createTRPCRouter } from "~/server/api/trpc";
import { bankrollRouter } from "./routers/bankroll";
import { sessionRouter } from "./routers/session";
import { tournamentRouter } from "./routers/tournaments";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  bankroll: bankrollRouter,
  session: sessionRouter,
  tournament: tournamentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
