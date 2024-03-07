"use client";
import Header from "@/components/Header";
import { updateInventoryGoodsAtom } from "@/lib/atom/inventory";
import { SelectGoodsType } from "@/lib/schema/GoodsSchema";
import { useAtom } from "jotai";
import React from "react";

import GoodsList from "../../_components/GoodsList";

export default function Page({
  searchParams,
}: {
  searchParams: { id: string };
}) {

  const [updateGoodsValue, setUpdateGoodsValue] = useAtom(
    updateInventoryGoodsAtom,
  );

  function onSwitchSelectGoods(goods: SelectGoodsType) {
    const isSelected = updateGoodsValue.find(
      (item) => item.goods.id === goods.id,
    );
    if (isSelected) {
      setUpdateGoodsValue(
        updateGoodsValue.filter((item) => item.goods.id !== goods.id),
      );
    } else {
      setUpdateGoodsValue((prev) => [...prev, { goods, num: 1, memo: "" }]);
    }
  }
  if(!searchParams.id) return null
  return (
    <div className="pb-28 pt-14">
      <Header title="添加商品" isBack />
      <GoodsList
        onSwitchGoods={onSwitchSelectGoods}
        selectedGoods={updateGoodsValue}
      />
    </div>
  );
}
