"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import React from "react";
import { useToast } from "@/components/ui/use-toast";

interface SwitchSelectedButtonProps {
  isSelected: boolean;
  shopId: string;
}
export default function SwitchSelectedButton({
  isSelected,
  shopId,
}: SwitchSelectedButtonProps) {
  const utils = api.useUtils();
  const { toast } = useToast();
  const { mutate, isLoading } = api.shop.switchUserSelectedShop.useMutation({
    async onSuccess() {
      await utils.shop.getShopsByUser.invalidate();
      await utils.goods.getGoodsByShopOfSelected.invalidate();
      toast({
        description: "修改成功",
        variant: "success",
        duration: 2000,
      });
    },
    onError(error) {
      toast({
        description: error.message,
        variant: "destructive",
      });
    },
  });
  return isSelected ? (
    <div className="text-sm text-foreground">已选择</div>
  ) : (
    <Button
      size="sm"
      variant="secondary"
      disabled={isLoading}
      onClick={() => mutate({ shopId })}
    >
      选择
    </Button>
  );
}
