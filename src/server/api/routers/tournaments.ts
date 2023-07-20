import { z } from "zod";
import { calculateROI } from "~/helpers/getRoi";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const tournamentRouter = createTRPCRouter({
  getAllTournaments: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.tournamentSession.findMany({ where: { userId: ctx.session.user.id } });
  }),

  getTournament: protectedProcedure
    .input(z.object({ tournamentId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.tournamentSession.findUnique({ where: { id: input.tournamentId } });
    }),

addTournament: protectedProcedure
  .input(z.object({ tournamentData: z.object({
    date: z.date(),
    buyIn: z.number(),
    numEntrants: z.number(),
    placeFinished: z.number(),
    cashed: z.boolean(),
    cashAmount: z.number(),
  }) }))
  .mutation(async ({ ctx, input }) => {
    const { buyIn, cashAmount } = input.tournamentData;
    const roi = calculateROI(buyIn, cashAmount);
    const profit = cashAmount - buyIn;
    return await ctx.prisma.tournamentSession.create({
      data: {
        ...input.tournamentData,
        profit,
        roi,
        userId: ctx.session.user.id
      }
    });
  }),

updateTournament: protectedProcedure
  .input(z.object({ tournamentId: z.string(), newTournamentData: z.object({
    date: z.date().optional(),
    buyIn: z.number().optional(),
    numEntrants: z.number().optional(),
    placeFinished: z.number().optional(),
    cashed: z.boolean().optional(),
    cashAmount: z.number().optional(),
  }) }))
  .mutation(async ({ ctx, input }) => {
    let roi;
    if (input.newTournamentData.buyIn || input.newTournamentData.cashAmount) {
      const tournament = await ctx.prisma.tournamentSession.findUnique({
        where: { id: input.tournamentId },
      });
      const newBuyIn = input.newTournamentData.buyIn ?? tournament?.buyIn ?? 0;
      const newCashAmount = input.newTournamentData.cashAmount ?? tournament?.cashAmount ?? 0;
      roi = calculateROI(newBuyIn, newCashAmount);
    }
    return await ctx.prisma.tournamentSession.update({
      where: { id: input.tournamentId },
      data: {
        ...input.newTournamentData,
        ...(roi && { roi }),
      },
    });
  }),

  deleteTournament: protectedProcedure
    .input(z.object({ tournamentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.tournamentSession.delete({ where: { id: input.tournamentId } });
    }),

  getTotals: protectedProcedure.query(async ({ ctx }) => {
    const tournaments = await ctx.prisma.tournamentSession.findMany({ where: { userId: ctx.session.user.id } });

    const totalTournaments = tournaments.length;
    const totalBuyIns = tournaments.reduce((acc, cur) => acc + cur.buyIn, 0);
    const totalCashes = tournaments.reduce((acc, cur) => acc + (cur.cashed ? cur.cashAmount : 0), 0);
    const roi = calculateROI(totalBuyIns, totalCashes);
    const itmPercentage = (tournaments.filter(t => t.cashed).length / totalTournaments) * 100;
    const finalTables = tournaments.filter(t => t.placeFinished <= 9).length;
    const top3 = tournaments.filter(t => t.placeFinished <= 3).length;
    const wins = tournaments.filter(t => t.placeFinished === 1).length;
    const averageBuyIn = totalBuyIns / totalTournaments;
    const profitLoss = totalCashes - totalBuyIns;

    return {
      totalTournaments: totalTournaments || 0,
      totalBuyIns: totalBuyIns || 0,
      totalCashes: totalCashes || 0,
      roi: roi || 0,
      itmPercentage: itmPercentage || 0,
      finalTables: finalTables || 0,
      top3: top3 || 0,
      wins: wins || 0,
      averageBuyIn: averageBuyIn || 0,
      profitLoss: profitLoss || 0,
    };
  }),
});

