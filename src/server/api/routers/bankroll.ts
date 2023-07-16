import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const bankrollRouter = createTRPCRouter({
  getAllBankrollEntries: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.bankroll.findMany({ where: { userId: ctx.session.user.id } });
  }),

  addDeposit: protectedProcedure
    .input(z.object({ amount: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.bankroll.create({
        data: {
          deposit: input.amount,
          userId: ctx.session.user.id
        }
      });
    }),

  addWithdrawal: protectedProcedure
    .input(z.object({ amount: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.bankroll.create({
        data: {
          withdrawal: input.amount,
          userId: ctx.session.user.id
        }
      });
    }),

  updateBankrollEntry: protectedProcedure
    .input(z.object({ entryId: z.string(), newEntryData: z.object({
      deposit: z.number().optional(),
      withdrawal: z.number().optional()
    }) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.bankroll.update({
        where: { id: input.entryId },
        data: input.newEntryData
      });
    }),

  deleteBankrollEntry: protectedProcedure
    .input(z.object({ entryId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.bankroll.delete({ where: { id: input.entryId } });
    }),
});
