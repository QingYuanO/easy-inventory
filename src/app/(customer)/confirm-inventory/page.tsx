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
  inventoryGoodsAtomsAtom,
  inventoryGoodsAtom,
} from "@/lib/atom/inventory";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { type PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
  const [addedGoods, dispatch] = useAtom(inventoryGoodsAtomsAtom);

  const [addedGoodsValue, setAddedGoodsValue] = useAtom(inventoryGoodsAtom);

  const { toast } = useToast();

  const router = useRouter();

  const [memo, setMemo] = useState("");

  const [name, setName] = useState("");

  const { mutate, isLoading } = api.inventory.confirmInventory.useMutation({
    async onSuccess() {
      setMemo("");
      toast({
        description: "提交成功",
        variant: "success",
        duration: 2000,
      });
      setTimeout(() => {
        setAddedGoodsValue([]);
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

  function onSubmit() {
    mutate({
      memo,
      name,
      goods: addedGoodsValue.map((item) => ({
        goodsId: item.goods.id,
        num: item.num,
        memo: item.memo,
      })),
    });
  }
  return (
    <div className="pb-4 pt-14">
      <Header title="确认清单" isBack />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">清单名称</Label>
          <Input
            id="name"
            value={name}
            onInput={(e) => setName(e.currentTarget.value)}
            placeholder="请输入清单名称"
          />
        </div>
        <Textarea
          placeholder="备注信息，告知店家一些注意事项"
          value={memo}
          onInput={(e) => setMemo(e.currentTarget.value)}
        />
        {addedGoods.map((item, idx) => (
          <GoodsCard
            key={idx}
            inventoryGoodsAtom={item}
            remove={() => dispatch({ type: "remove", atom: item })}
          />
        ))}
      </div>
      <div className="flex h-14 w-full items-center px-4">
        <Button
          variant="default"
          className="w-full"
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? "提交中..." : "提交"}
        </Button>
      </div>
    </div>
  );
}
const GoodsCard = (props: {
  inventoryGoodsAtom: PrimitiveAtom<InventoryGoods>;
  remove: () => void;
}) => {
  const { inventoryGoodsAtom } = props;
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
