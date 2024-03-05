import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  goods,
  goodsToInventories,
  inventories,
  inventoriesRelations,
  inventoryEnum,
  shops,
  users,
  usersToShops,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { withCursorPagination } from "drizzle-pagination";
import { z } from "zod";

export const inventoryRouter = createTRPCRouter({
  confirmInventory: protectedProcedure
    .input(
      z.object({
        memo: z.string().optional(),
        name: z.string().optional(),
        goods: z.array(
          z.object({
            goodsId: z.string(),
            num: z.number(),
            memo: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { session, db } = ctx;
      const { user } = session;
      const selectedShop = await db.query.usersToShops.findFirst({
        where: and(
          eq(usersToShops.userId, user.id),
          eq(usersToShops.isSelected, true),
        ),
      });
      if (input.goods.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "商品不能为空",
        });
      }
      if (!selectedShop) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "没有绑定的店铺",
        });
      }
      if (!selectedShop.isActivity) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "无法提交，当前店铺已锁定了你的账号",
        });
      }
      await db.transaction(async (tx) => {
        const data = await tx
          .insert(inventories)
          .values({
            name: input.name ?? "清单",
            userId: user.id,
            memo: input.memo,
            shopId: selectedShop.shopId,
            status: "WAIT",
          })
          .returning();
        const insertInventory = data[0];
        if (!insertInventory) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "创建清单失败",
          });
        }
        for (const item of input.goods) {
          await tx.insert(goodsToInventories).values({
            inventoryId: insertInventory.id,
            goodsId: item.goodsId,
            num: item.num,
            memo: item.memo,
          });
        }
      });
    }),
  getInventories: protectedProcedure
    .input(
      z.object({
        status: z.enum(inventoryEnum.enumValues).optional(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { user } = session;
      const { cursor } = input;
      const limit = input.limit ?? 10;

      const list = await db.query.inventories.findMany({
        ...withCursorPagination({
          where: and(
            user.type === "user"
              ? eq(inventories.userId, user.id)
              : eq(inventories.shopId, user.id),
            input.status ? eq(inventories.status, input.status) : undefined,
          ),
          limit: limit + 1,
          cursors: [
            [
              goods.cursor, // Column to use for cursor
              "desc", // Sort order ('asc' or 'desc')
              cursor ? cursor - 1 : undefined, // Cursor value
            ],
          ],
        }),
        with: {
          shop: true,
          user: true,
          goodsToInventories: {
            with: {
              goods: true,
            },
            columns: {
              num: true,
              memo: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (list.length > limit) {
        const nextItem = list.pop();
        nextCursor = nextItem?.cursor;
      }
      return { list, nextCursor };
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { user } = session;
      const { id } = input;

      const data = await db.query.inventories.findFirst({
        where: and(
          eq(inventories.id, id),
          user.type === "user"
            ? eq(inventories.userId, user.id)
            : eq(inventories.shopId, user.id),
        ),
        with: {
          shop: true,
          goodsToInventories: {
            with: {
              goods: true,
            },
            columns: {
              num: true,
              memo: true,
            },
          },
        },
      });
      if (!data) {
        throw new TRPCError({ code: "NOT_FOUND", message: "清单不存在" });
      }
      return data;
    }),
});
