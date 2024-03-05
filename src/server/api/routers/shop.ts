import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { shops, users, usersToShops } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const shopRouter = createTRPCRouter({
  getShopsByUser: protectedProcedure.query(async ({ ctx }) => {
    const { session, db } = ctx;
    const { user } = session;
    const shopList = await db
      .select({
        name: shops.name,
        phone: shops.phone,
        id: shops.id,
        isSelected: usersToShops.isSelected,
        isActivity: usersToShops.isActivity,
        description: shops.description,
      })
      .from(usersToShops)
      .leftJoin(users, eq(usersToShops.userId, users.id))
      .leftJoin(shops, eq(usersToShops.shopId, shops.id))
      .where(eq(users.id, user.id));
    return shopList;
  }),
  getShopByUserSelected: protectedProcedure.query(async ({ ctx }) => {
    const { session, db } = ctx;
    const { user } = session;
    const userToShop = await db.query.usersToShops.findFirst({
      where: and(
        eq(usersToShops.userId, user.id),
        eq(usersToShops.isSelected, true),
      ),
    });

    if (!userToShop) {
      return null;
    }
    const selectedShop = await db.query.shops.findFirst({
      where: eq(shops.id, userToShop?.shopId),
    });
    return selectedShop;
  }),
  switchUserSelectedShop: protectedProcedure
    .input(z.object({ shopId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;
      const { user } = session;

      const usersToShopsList = await db
        .select()
        .from(usersToShops)
        .where(eq(usersToShops.userId, user.id));

      await db.transaction(async (tx) => {
        for (const usersToShopsObj of usersToShopsList) {
          await tx
            .update(usersToShops)
            .set({ isSelected: usersToShopsObj.shopId === input.shopId })
            .where(
              and(
                eq(usersToShops.shopId, usersToShopsObj.shopId),
                eq(usersToShops.userId, usersToShopsObj.userId),
              ),
            );
        }
      });
      return { success: true };
    }),
});
