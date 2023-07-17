import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const sessionRouter = createTRPCRouter({
  getAllSessions: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.pokerSession.findMany(({ where: { userId: ctx.session.user.id } }));
  }),

  getSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.pokerSession.findUnique({ where: { id: input.sessionId } });
    }),

  addSession: protectedProcedure
    .input(z.object({ sessionData: z.object({
      date: z.date(),
      stakes: z.string(),
      buyIn: z.number(),
      cashOut: z.number(),
      duration: z.number()
    }) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.pokerSession.create({
        data: {
          ...input.sessionData,
          userId: ctx.session.user.id
        }
      });
    }),

  updateSession: protectedProcedure
    .input(z.object({ sessionId: z.string(), newSessionData: z.object({
      date: z.date().optional(),
      stakes: z.string().optional(),
      buyIn: z.number().optional(),
      cashOut: z.number().optional(),
      duration: z.number().optional()
    }) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.pokerSession.update({
        where: { id: input.sessionId },
        data: input.newSessionData
      });
    }),

  deleteSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.pokerSession.delete({ where: { id: input.sessionId } });
    }),
});
