// import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { goodsRouter } from "./routers/goods";
import { shopRouter } from "./routers/shop";
import { inventoryRouter } from "./routers/inventory";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  goods: goodsRouter,
  user: userRouter,
  shop:shopRouter,
  inventory:inventoryRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
