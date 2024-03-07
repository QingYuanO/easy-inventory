"use client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { type InventoryGoods, inventoryGoodsAtom } from "@/lib/atom/inventory";
import { type SelectGoodsType } from "@/lib/schema/GoodsSchema";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useAtom } from "jotai";
import { Ghost, Loader2, PlusSquare, XSquare } from "lucide-react";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Input } from "@/components/ui/input";

interface GoodsListProps {
  onSwitchGoods: (goods: SelectGoodsType) => void;
  selectedGoods: InventoryGoods[];
}

export default function GoodsList({
  onSwitchGoods,
  selectedGoods,
}: GoodsListProps) {
  const nameRef = React.useRef<HTMLInputElement>(null);

  const [name, setName] = useState<string>();

  const { data, isLoading, fetchNextPage, hasNextPage } =
    api.goods.getGoodsByShopOfSelected.useInfiniteQuery(
      {
        limit: 10,
        name,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  function onSearch() {
    if (nameRef.current) {
      setName(nameRef.current.value);
    }
  }

  const list = data?.pages.flatMap((page) => page.list);

  return (
    <>
      <div className="mt-4 flex gap-4 px-4">
        <Input ref={nameRef} placeholder="请输入商品名" />
        <Button onClick={onSearch}>搜索</Button>
      </div>
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
            <GoodsCard
              key={goods.id}
              goods={goods}
              isSelected={
                !!selectedGoods.find((item) => item.goods.id === goods.id)
              }
              onSwitchSelectGoods={onSwitchGoods}
            />
          ))}
        </InfiniteScroll>
      ) : (
        <div className="mt-20 flex flex-col items-center gap-2">
          <Ghost className="size-8 text-zinc-800" />
          <h3 className="font-semibold">没有查询到商品</h3>
        </div>
      )}
    </>
  );
}

const GoodsCard = (props: {
  goods: SelectGoodsType;
  isSelected: boolean;
  onSwitchSelectGoods: (goods: SelectGoodsType) => void;
}) => {
  const { goods, isSelected, onSwitchSelectGoods } = props;
  const [addedGoods, setGoods] = useAtom(inventoryGoodsAtom);
  // const isSelected = addedGoods.find((item) => item.goods.id === goods.id);
  // function onSwitchSelectGoods(goods: SelectGoodsType) {
  //   if (isSelected) {
  //     setGoods(addedGoods.filter((item) => item.goods.id !== goods.id));
  //   } else {
  //     setGoods((prev) => [...prev, { goods, num: 1, memo: "" }]);
  //   }
  // }

  return (
    <div
      key={goods.id}
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow",
        isSelected && "outline outline-foreground",
      )}
    >
      <div className="flex flex-col gap-1">
        <p className="text font-bold">{goods.name}</p>
        <p className="text-sm text-muted-foreground">{goods.description}</p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div>
          {isSelected && <div className="text-sm text-foreground">已添加</div>}
        </div>
        <div onClick={() => onSwitchSelectGoods(goods)}>
          {isSelected ? (
            <XSquare className="cursor-pointer text-red-300" />
          ) : (
            <PlusSquare className="cursor-pointer" />
          )}
        </div>
      </div>
    </div>
  );
};
