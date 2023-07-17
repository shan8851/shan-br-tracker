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
    .input(z.object({
      sessionData: z.object({
        date: z.date(),
        stakes: z.string(),
        buyIn: z.number(),
        cashOut: z.number(),
        duration: z.number()
      })
    }))
    .mutation(async ({ ctx, input }) => {
      const { buyIn, cashOut, duration } = input.sessionData;
      const profit = cashOut - buyIn;
      const hourly = profit / duration;

      return await ctx.prisma.pokerSession.create({
        data: {
          ...input.sessionData,
          profit,
          hourly,
          userId: ctx.session.user.id
        }
      });
    }),


  updateSession: protectedProcedure
    .input(z.object({
      sessionId: z.string(), newSessionData: z.object({
        date: z.date().optional(),
        stakes: z.string().optional(),
        buyIn: z.number().optional(),
        cashOut: z.number().optional(),
        duration: z.number().optional()
      })
    }))
    .mutation(async ({ ctx, input }) => {
      const { buyIn, cashOut, duration } = input.newSessionData;
      let profit, hourly;
      if (buyIn || cashOut || duration) {
        const session = await ctx.prisma.pokerSession.findUnique({
          where: { id: input.sessionId },
        });
        const newBuyIn = buyIn ?? session?.buyIn ?? 0;
        const newCashOut = cashOut ?? session?.cashOut ?? 0;
        const newDuration = duration ?? session?.duration ?? 0;

        profit = newCashOut - newBuyIn;
        hourly = profit / newDuration;
      }

      return await ctx.prisma.pokerSession.update({
        where: { id: input.sessionId },
        data: {
          ...input.newSessionData,
          ...(profit && { profit }),
          ...(hourly && { hourly }),
        },
      });
    }),


  deleteSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.pokerSession.delete({ where: { id: input.sessionId } });
    }),

  getTotals: protectedProcedure.query(async ({ ctx }) => {
    // Get all sessions for the current user
    const sessions = await ctx.prisma.pokerSession.findMany(({ where: { userId: ctx.session.user.id } }));

    // Calculate the totals
    const totalProfit = sessions.reduce((sum, session) => sum + session.profit, 0);
    const totalHours = sessions.reduce((sum, session) => sum + session.duration, 0);
    const totalHourly = totalProfit / totalHours;

    // Return the totals
    return {
      totalProfit,
      totalHours,
      totalHourly,
    };
  }),
});
