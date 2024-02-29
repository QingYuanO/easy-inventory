import { UpdateUserSchema } from "@/lib/schema/UpdateUserSchema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { shops, users, usersToShops } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUsersByShop: protectedProcedure.query(async ({ ctx }) => {
    const { session, db } = ctx;
    const { user } = session;

    if (user.type !== "shop") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "你无权查询全部用户",
      });
    }
    const userList = await db
      .select({
        name: users.name,
        phone: users.phone,
        id: users.id,
        account: users.account,
        isActivity: usersToShops.isActivity,
      })
      .from(usersToShops)
      .leftJoin(users, eq(usersToShops.userId, users.id))
      .leftJoin(shops, eq(usersToShops.shopId, shops.id))
      .where(eq(shops.id, user.id));
    return userList;
  }),
  switchUserActivity: protectedProcedure
    .input(z.object({ userId: z.string(), status: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;
      const { user } = session;

      if (user.type !== "shop") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "你无权切换用户状态",
        });
      }
      await db
        .update(usersToShops)
        .set({ isActivity: input.status })
        .where(
          and(
            eq(usersToShops.shopId, user.id),
            eq(usersToShops.userId, input.userId),
          ),
        );
      return { success: true };
    }),
  create: protectedProcedure
    .input(UpdateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;
      const { user } = session;

      if (user.type !== "shop") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "你无权创建用户",
        });
      }
      const userRes = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.account, input.account));
      const userExist = userRes[0];

      if (userExist) {
        const userOfShop = await db
          .select()
          .from(usersToShops)
          .where(
            and(
              eq(usersToShops.shopId, user.id),
              eq(usersToShops.userId, userExist.id),
            ),
          );

        if (userOfShop.length > 0) {
          throw new TRPCError({ code: "CONFLICT", message: "用户已存在" });
        } else {
          await db
            .insert(usersToShops)
            .values({ shopId: user.id, userId: userExist.id });
          return { success: true };
        }
      } else {
        const res = await db
          .insert(users)
          .values({
            name: input.name,
            phone: input.phone,
            account: input.account,
          })
          .returning();
        const newUser = res[0];
        if (newUser) {
          await db
            .insert(usersToShops)
            .values({ shopId: user.id, userId: newUser.id });
        }
        return { success: true };
      }
    }),
});
