import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const sessionRouter = createTRPCRouter({
  getAllSessions: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.cashSession.findMany(({ where: { userId: ctx.session.user.id } }));
  }),

  getSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.cashSession.findUnique({ where: { id: input.sessionId } });
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

      return await ctx.prisma.cashSession.create({
        data: {
          ...input.sessionData,
          profit,
          hourly,
          userId: ctx.session.user.id
        }
      });
    }),


  deleteSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.cashSession.delete({ where: { id: input.sessionId } });
    }),

getTotals: protectedProcedure.query(async ({ ctx }) => {
  const sessions = await ctx.prisma.cashSession.findMany(({ where: { userId: ctx.session.user.id }, orderBy: { date: 'asc' } }));

  const totalSessions = sessions.length;
  const totalProfit = sessions.reduce((sum, session) => sum + session.profit, 0);
  const totalHours = sessions.reduce((sum, session) => sum + session.duration, 0);
  const totalHourly = totalSessions ? totalProfit / totalHours : 0;

  const winningSessions = sessions.filter(session => session.profit > 0).length;
  const losingSessions = sessions.filter(session => session.profit < 0).length;

  const firstSessionDate = sessions[0]?.date;
  const lastSessionDate = sessions[sessions.length - 1]?.date;

  const winningSessionPercent = totalSessions ? (winningSessions / totalSessions) * 100 : 0;
  const losingSessionPercent = totalSessions ? (losingSessions / totalSessions) * 100 : 0;

  return {
    totalSessions: totalSessions || 0,
    totalProfit: totalProfit || 0,
    totalHours: totalHours || 0,
    totalHourly: totalHourly || 0,
    winningSessions: winningSessions || 0,
    losingSessions: losingSessions || 0,
    firstSessionDate,
    lastSessionDate,
    winningSessionPercent: winningSessionPercent || 0,
    losingSessionPercent: losingSessionPercent || 0,
  };
}),

});
