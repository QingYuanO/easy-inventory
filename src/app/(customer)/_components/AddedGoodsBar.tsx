"use client";
import { Button } from "@/components/ui/button";
import {
  inventoryGoodsAtom,
  inventoryMemoAtom,
  inventoryNameAtom,
  updateInventoryGoodsAtom,
} from "@/lib/atom/inventory";
import { useAtomValue, useSetAtom } from "jotai";
import Link from "next/link";
import React from "react";

export default function AddedGoodsBar() {
  const addedGoods = useAtomValue(inventoryGoodsAtom);
  const setInventoryName = useSetAtom(inventoryNameAtom);
  const setInventoryMemo = useSetAtom(inventoryMemoAtom);
  const setUpdateGoodsValue = useSetAtom(updateInventoryGoodsAtom);
  if (addedGoods.length === 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-14 z-10 flex h-14 items-center justify-between border-t border-border bg-background p-4 shadow sm:mx-auto sm:max-w-2xl">
      <div className="text-sm">已添加商品{addedGoods.length}件</div>
      <Button variant={"default"} size="sm" asChild>
        <Link
          href="/inventories/edit?type=create"
          onClick={() => {
            setInventoryName("");
            setInventoryMemo("");
            setUpdateGoodsValue(addedGoods);
          }}
        >
          确认清单
        </Link>
      </Button>
    </div>
  );
}
