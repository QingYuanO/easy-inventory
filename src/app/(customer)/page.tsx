"use client";
import Header from "@/components/Header";
import { buttonVariants } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Ghost, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
export default function Page() {
  const { data, isLoading, fetchNextPage, hasNextPage } =
    api.goods.getGoodsByShopOfSelected.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        // initialCursor: 1,
      },
    );
  const { data: shopList } = api.shop.getShopsByUser.useQuery();
  const selectedShop = shopList?.find((shop) => shop.isSelected);
  const list = data?.pages.flatMap((page) => page.list);
  return (
    <div className="py-14">
      <Header title={`${selectedShop?.name ?? "xxx"}的商品`} />
      {isLoading ? (
        <div className="mt-20 flex items-center justify-center">
          <Loader2 className="size-6 animate-spin" />
          <p className="text-sm">加载中...</p>
        </div>
      ) : list && list.length > 0 ? (
        <InfiniteScroll
          dataLength={list.length}
          next={fetchNextPage}
          className="flex flex-col gap-4 p-4"
          hasMore={!!hasNextPage}
          loader={
            <div className=" flex items-center justify-center">
              <Loader2 className="size-4" />
              <p className="text-sm">加载中</p>
            </div>
          }
          endMessage={
            <div className=" flex items-center justify-center">
              <p className="text-sm text-muted-foreground">没有更多了</p>
            </div>
          }
        >
          {list?.map((goods) => (
            <div
              key={goods.id}
              className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow"
            >
              <div className="flex flex-col gap-1">
                <p className="text font-bold">{goods.name}</p>
                <p className="text-sm text-muted-foreground">
                  {goods.description}
                </p>
              </div>
              <div className="flex justify-end gap-2"></div>
            </div>
          ))}
        </InfiniteScroll>
      ) : (
        <div className="mt-20 flex flex-col items-center gap-2">
          <Ghost className="size-8 text-zinc-800" />
          <h3 className="text-xl font-semibold">当前店铺还没有商品</h3>
        </div>
      )}
    </div>
  );
}
