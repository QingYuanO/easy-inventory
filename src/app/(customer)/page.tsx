"use client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { inventoryGoodsAtom } from "@/lib/atom/inventory";
import { SelectGoodsType } from "@/lib/schema/GoodsSchema";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useAtom } from "jotai";
import { Ghost, Loader2, PlusSquare, XSquare } from "lucide-react";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import AddedGoodsBar from "./_components/AddedGoodsBar";
import { Input } from "@/components/ui/input";
import GoodsList from "./_components/GoodsList";
export default function Page() {
  const { data: selectedShop } = api.shop.getShopByUserSelected.useQuery();

  const [addedGoods, setGoods] = useAtom(inventoryGoodsAtom);

  function onSwitchSelectGoods(goods: SelectGoodsType) {
    const isSelected = addedGoods.find((item) => item.goods.id === goods.id);
    if (isSelected) {
      setGoods(addedGoods.filter((item) => item.goods.id !== goods.id));
    } else {
      setGoods((prev) => [...prev, { goods, num: 1, memo: "" }]);
    }
  }
  return (
    <div className="pb-28 pt-14">
      <Header title={`${selectedShop?.name ?? "xxx"}的商品`} />
      <GoodsList
        onSwitchGoods={onSwitchSelectGoods}
        selectedGoods={addedGoods}
      />

      <AddedGoodsBar />
    </div>
  );
}
