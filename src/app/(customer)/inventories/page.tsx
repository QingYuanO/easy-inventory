"use client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  inventoryMemoAtom,
  inventoryNameAtom,
  updateInventoryGoodsAtom,
} from "@/lib/atom/inventory";
import { getInventoryStatusColor, getInventoryStatusText } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useAtom, useSetAtom } from "jotai";
import { Ghost, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Page() {
  const { data, isLoading, fetchNextPage, hasNextPage } =
    api.inventory.getInventories.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );
  const list = data?.pages.flatMap((page) => page.list);
  const setInventoryName = useSetAtom(inventoryNameAtom);
  const setInventoryMemo = useSetAtom(inventoryMemoAtom);
  const setUpdateGoodsValue = useSetAtom(updateInventoryGoodsAtom);
  return (
    <div className="pb-28 pt-14">
      <Header title="我的清单" isBack />

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
          {list?.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 divide-y divide-border rounded-lg border border-border bg-card p-4 shadow"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text font-bold">{item.name}</p>
                  <p
                    style={{ color: getInventoryStatusColor(item.status) }}
                    className="text-sm"
                  >
                    {getInventoryStatusText(item.status)}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{item.memo}</p>
              </div>
              <div className="flex flex-col gap-1 pt-2">
                <p className="text-sm text-foreground">
                  店家：{item.shop.name}
                </p>
                <p className="text-sm text-foreground">
                  电话：{item.shop.phone}
                </p>
                <p className="text-sm text-foreground">
                  商品：共{item.goodsToInventories.length}种
                </p>
              </div>
              <div className="flex justify-between pt-2">
                <Button variant={"secondary"} size="sm" asChild>
                  <a href={`tel:${item.shop.phone}`}>拨打电话</a>
                </Button>
                <Button variant={"default"} size="sm" asChild>
                  <Link
                    onClick={() => {
                      setInventoryMemo(item.memo ?? "");
                      setInventoryName(item.name);
                      setUpdateGoodsValue(
                        item.goodsToInventories.map((item) => ({
                          ...item,
                          memo: item.memo ?? "",
                        })),
                      );
                    }}
                    href={`/inventories/edit?id=${item.id}&type=${item.status === "WAIT" ? "update" : "view"}`}
                  >
                    {item.status === "WAIT" ? "编辑" : "详情"}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      ) : (
        <div className="mt-20 flex flex-col items-center gap-2">
          <Ghost className="size-8 text-zinc-800" />
          <h3 className="font-semibold">你还没有清单，快去添加吧</h3>
        </div>
      )}
    </div>
  );
}
