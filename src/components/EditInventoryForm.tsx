"use client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  type InventoryGoods,
  updateInventoryGoodsAtom,
  updateInventoryGoodsAtomsAtom,
  inventoryGoodsAtom,
  inventoryMemoAtom,
  inventoryNameAtom,
} from "@/lib/atom/inventory";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { type PrimitiveAtom, useAtom, useAtomValue } from "jotai";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export type EditType = "create" | "update" | "view";
interface EditInventoryFormProps {
  type: EditType;
  id?: string;
}
export default function EditInventoryForm({
  type,
  id,
}: EditInventoryFormProps) {
  const [updateGoods, dispatch] = useAtom(updateInventoryGoodsAtomsAtom);

  const [updateGoodsValue, setUpdateGoodsValue] = useAtom(
    updateInventoryGoodsAtom,
  );
  const [, setAddedGoods] = useAtom(inventoryGoodsAtom);

  const { toast } = useToast();

  const router = useRouter();

  const [memo, setMemo] = useAtom(inventoryMemoAtom);

  const [name, setName] = useAtom(inventoryNameAtom);

  const isView = type === "view";
  const confirmMutation = api.inventory.confirmInventory.useMutation({
    async onSuccess() {
      setMemo("");
      toast({
        description: "提交成功",
        variant: "success",
        duration: 2000,
      });
      setTimeout(() => {
        setAddedGoods([]);
        router.back();
      }, 500);
    },
    onError(error) {
      toast({
        description: error.message ?? '"提交失败"',
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  const updateMutation = api.inventory.updateInventory.useMutation({
    async onSuccess() {
      setMemo("");
      toast({
        description: "修改成功",
        variant: "success",
        duration: 2000,
      });
      setTimeout(() => {
        setUpdateGoodsValue([]);
        router.back();
      }, 500);
    },
    onError(error) {
      toast({
        description: error.message ?? "修改失败",
        variant: "destructive",
        duration: 2000,
      });
    },
  });

  const isLoading = id ? updateMutation.isLoading : confirmMutation.isLoading;

  function onSubmit() {
    const postData = {
      memo,
      name,
      goods: updateGoodsValue.map((item) => ({
        goodsId: item.goods.id,
        num: item.num,
        memo: item.memo,
      })),
    };
    if (id) {
      updateMutation.mutate({
        id,
        ...postData,
      });
    } else {
      confirmMutation.mutate(postData);
    }
  }
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">清单名称</Label>
          <Input
            id="name"
            value={name}
            onInput={(e) => setName(e.currentTarget.value)}
            placeholder="请输入清单名称"
            disabled={isView}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="memo">备注</Label>
          <Textarea
            id="memo"
            placeholder="备注信息，告知店家一些注意事项"
            value={memo}
            onInput={(e) => setMemo(e.currentTarget.value)}
            disabled={isView}
          />
        </div>
        {updateGoods.map((item, idx) => (
          <GoodsCard
            key={idx}
            inventoryGoodsAtom={item}
            remove={() => dispatch({ type: "remove", atom: item })}
            type={type}
          />
        ))}
      </div>
      {type !== "view" && (
        <div className="mt-4 flex h-14 w-full items-center px-4">
          <Button
            variant="default"
            className="w-full"
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? "提交中..." : "提交"}
          </Button>
        </div>
      )}
    </>
  );
}
const GoodsCard = (props: {
  inventoryGoodsAtom: PrimitiveAtom<InventoryGoods>;
  type: EditType;
  remove: () => void;
}) => {
  const { inventoryGoodsAtom, type } = props;
  const inventoryGoods = useAtomValue(inventoryGoodsAtom);
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 divide-y divide-border rounded-lg border border-border bg-card p-4 shadow",
      )}
    >
      <div className="flex flex-col gap-1">
        <p className="text font-bold">{inventoryGoods.goods.name}</p>
        <p className="text-sm text-muted-foreground">
          {inventoryGoods.goods.description}
        </p>
      </div>
      <div className="pt-2">
        <div className="text-sm text-foreground">
          数量：{inventoryGoods.num}件
        </div>
        <div className="text-sm text-foreground">
          备注：{inventoryGoods.memo ? inventoryGoods.memo : "-"}
        </div>
      </div>
      {type !== "view" && (
        <div className="flex items-center justify-between gap-2 pt-2">
          <Button onClick={props.remove} size={"sm"} variant={"destructive"}>
            移除
          </Button>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant={"default"} size={"sm"}>
                编辑
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{inventoryGoods.goods.name}</DrawerTitle>
                <DrawerDescription>
                  {inventoryGoods.goods.description}
                </DrawerDescription>
              </DrawerHeader>
              <EditForm inventoryGoodsAtom={inventoryGoodsAtom} />
              <DrawerFooter>
                <DrawerClose>
                  <Button variant="outline" className="w-full">
                    关闭
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </div>
  );
};

const EditForm = (props: {
  inventoryGoodsAtom: PrimitiveAtom<InventoryGoods>;
}) => {
  const [inventoryGoods, set] = useAtom(props.inventoryGoodsAtom);
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2 ">
        <Label htmlFor="num">数量</Label>
        <Input
          type="number"
          id="num"
          className="h-8"
          value={inventoryGoods.num}
          onInput={(e) =>
            set({ ...inventoryGoods, num: Number(e.currentTarget.value) })
          }
        />
      </div>
      <div className="flex flex-col gap-2 ">
        <Label htmlFor="memo">备注</Label>
        <Textarea
          id="memo"
          className="h-8 "
          value={inventoryGoods.memo}
          onInput={(e) =>
            set({ ...inventoryGoods, memo: e.currentTarget.value })
          }
        />
      </div>
    </div>
  );
};
