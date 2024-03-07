"use client";
import Header from "@/components/Header";
import { buttonVariants } from "@/components/ui/button";
import { SelectGoodsType } from "@/lib/schema/GoodsSchema";
import { api } from "@/trpc/react";
import { Ghost, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SwitchGoodsActivityButton from "./_components/SwitchGoodsActivityButton";
export default function Page() {
  const { data, isLoading, fetchNextPage, hasNextPage } =
    api.goods.getGoodsByShop.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        // initialCursor: 1,
      },
    );
  const list = data?.pages.flatMap((page) => page.list);
  return (
    <div className="pt-14">
      <Header
        title="管理商品"
        rightContent={
          <Link
            href="/shop/goods/edit?type=create"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            添加
          </Link>
        }
        isBack
      />
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
              <div className="flex justify-end gap-2">
                <SwitchGoodsActivityButton
                  isActivity={goods.isActivity}
                  goodsId={goods.id}
                />
                <Link
                  href={`/shop/goods/edit?type=update&goodsId=${goods.id}`}
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                  })}
                >
                  修改
                </Link>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      ) : (
        <div className="mt-20 flex flex-col items-center gap-2">
          <Ghost className="size-8 text-zinc-800" />
          <h3 className="font-semibold">你还没有商品</h3>
          <Link
            href="/shop/goods/edit?type=create"
            className={buttonVariants({ variant: "secondary" })}
          >
            立即创建
          </Link>
        </div>
      )}
    </div>
  );
}
