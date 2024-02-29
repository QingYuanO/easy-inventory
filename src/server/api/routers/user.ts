import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { shops, users, usersToShops } from "@/server/db/schema";
import { phoneRegex } from "@/lib/regExp";
import { TRPCError } from "@trpc/server";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
      .select({ name: users.name, phone: users.phone, id: users.id })
      .from(usersToShops)
      .leftJoin(users, eq(usersToShops.userId, users.id))
      .leftJoin(shops, eq(usersToShops.shopId, shops.id))
      .where(eq(shops.id, user.id));
    return userList;
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        phone: z.string().regex(phoneRegex, "请输入正确的手机号!"),
      }),
    )
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
        .where(eq(users.phone, input.phone));
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
