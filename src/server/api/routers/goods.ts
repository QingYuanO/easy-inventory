import { EditGoodsSchema } from "@/lib/schema/GoodsSchema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { goods, shops, users, usersToShops } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq, ilike, like } from "drizzle-orm";
import { z } from "zod";
import { withCursorPagination } from "drizzle-pagination";

export const goodsRouter = createTRPCRouter({
  getGoodsByShop: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { session, db } = ctx;
      const { user: shopUser } = session;
      const { cursor } = input;
      const limit = input.limit ?? 10;
      if (shopUser.type !== "shop") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "无权限",
        });
      }
      console.log(input);

      const goodsList = await db.query.goods.findMany(
        withCursorPagination({
          where: eq(goods.shopId, shopUser.id),
          limit: limit + 1,
          cursors: [
            [
              goods.cursor, // Column to use for cursor
              "desc", // Sort order ('asc' or 'desc')
              cursor ? cursor - 1 : undefined, // Cursor value
            ],
          ],
        }),
      );
      let nextCursor: typeof cursor | undefined = undefined;
      if (goodsList.length > limit) {
        const nextItem = goodsList.pop();
        nextCursor = nextItem!.cursor;
      }

      return {
        list: goodsList,
        nextCursor,
      };
    }),
  getSingleGoods: protectedProcedure
    .input(z.object({ goodsId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const goodsRes = await db
        .select()
        .from(goods)
        .where(eq(goods.id, input.goodsId));
      const goodsExist = goodsRes[0];
      if (goodsExist) {
        return goodsExist;
      } else {
        throw new TRPCError({ code: "CONFLICT", message: "商品不存在" });
      }
    }),
  //goods 的增删改查
  create: protectedProcedure
    .input(EditGoodsSchema)
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;
      const { user: shopUser } = session;

      if (shopUser.type !== "shop") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "无权限",
        });
      }
      const goodsRes = await db
        .select({ id: goods.id })
        .from(goods)
        .where(and(eq(goods.name, input.name), eq(goods.shopId, shopUser.id)));
      const goodsExist = goodsRes[0];

      if (goodsExist) {
        throw new TRPCError({ code: "CONFLICT", message: "商品已存在" });
      } else {
        await db
          .insert(goods)
          .values({ ...input, shopId: shopUser.id })
          .returning();

        return { success: true };
      }
    }),
  update: protectedProcedure
    .input(EditGoodsSchema.merge(z.object({ goodsId: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;
      const { user: shopUser } = session;

      if (shopUser.type !== "shop") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "无权限",
        });
      }
      console.log(input);

      const goodsRes = await db
        .select({ id: goods.id })
        .from(goods)
        .where(eq(goods.id, input.goodsId));
      const goodsExist = goodsRes[0];
      if (goodsExist) {
        await db
          .update(goods)
          .set({ name: input.name, description: input.description })
          .where(eq(goods.id, input.goodsId));
        return { success: true };
      } else {
        throw new TRPCError({ code: "CONFLICT", message: "商品不存在" });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ goodsId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;
      const { user: shopUser } = session;

      if (shopUser.type !== "shop") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "无权限",
        });
      }
      const goodsRes = await db
        .select({ id: goods.id })
        .from(goods)
        .where(eq(goods.id, input.goodsId));
      const goodsExist = goodsRes[0];
      if (goodsExist) {
        await db.delete(goods).where(eq(goods.id, input.goodsId));
        return { success: true };
      } else {
        throw new TRPCError({ code: "CONFLICT", message: "商品不存在" });
      }
    }),
  switchGoodsActivity: protectedProcedure
    .input(z.object({ goodsId: z.string(), status: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;
      const { user } = session;

      if (user.type !== "shop") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "你无权切换商品状态",
        });
      }
      await db
        .update(goods)
        .set({ isActivity: input.status })
        .where(eq(goods.id, input.goodsId));
      return { success: true };
    }),
  //查找客户当前选择的店铺下的商品
  getGoodsByShopOfSelected: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
        name: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { session, db } = ctx;
      const { user } = session;
      const { cursor } = input;
      const limit = input.limit ?? 10;

      const selectedShopRes = await db
        .select({ shopId: usersToShops.shopId })
        .from(usersToShops)
        .leftJoin(users, eq(usersToShops.userId, users.id))
        .leftJoin(shops, eq(usersToShops.shopId, shops.id))
        .where(
          and(
            eq(usersToShops.userId, user.id),
            eq(usersToShops.isSelected, true),
          ),
        );

      let shopId;
      if (selectedShopRes.length > 0) {
        const selectedShop = selectedShopRes[0];
        shopId = selectedShop?.shopId;
      } else {
        const first = await db.query.usersToShops.findFirst({
          where: eq(usersToShops.userId, user.id),
        });

        if (first) {
          await db.insert(usersToShops).values({ ...first, isSelected: true });
          shopId = first.shopId;
        } else {
          //说名该用户没有绑定店铺
          return {
            list: [],
            nextCursor: null,
          };
        }
      }

      if (!shopId) {
        return {
          list: [],
          nextCursor: null,
        };
      }
      console.log(input.name);
      
      const where = input.name
        ? and(
            eq(goods.shopId, shopId),
            eq(goods.isActivity, true),
            like(goods.name, `%${input.name}%`),
          )
        : and(eq(goods.shopId, shopId), eq(goods.isActivity, true));
      const goodsList = await db.query.goods.findMany(
        withCursorPagination({
          where: where,
          limit: limit + 1,
          cursors: [
            [
              goods.cursor, // Column to use for cursor
              "desc", // Sort order ('asc' or 'desc')
              cursor ? cursor - 1 : undefined, // Cursor value
            ],
          ],
        }),
      );
      let nextCursor: typeof cursor | undefined = undefined;
      if (goodsList.length > limit) {
        const nextItem = goodsList.pop();
        nextCursor = nextItem!.cursor;
      }

      return {
        list: goodsList,
        nextCursor,
      };
    }),
});
