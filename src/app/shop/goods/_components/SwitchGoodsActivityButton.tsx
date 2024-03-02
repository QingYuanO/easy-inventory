"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import React from "react";
import { useToast } from "@/components/ui/use-toast";

interface SwitchGoodsActivityButtonProps {
  isActivity: boolean;
  goodsId: string;
}
export default function SwitchGoodsActivityButton({
  isActivity,
  goodsId,
}: SwitchGoodsActivityButtonProps) {
  const utils = api.useUtils();
  const { toast } = useToast();
  const { mutate, isLoading } = api.goods.switchGoodsActivity.useMutation({
    async onSuccess() {
      await utils.goods.getGoodsByShop.invalidate();
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
  return (
    <Button
      size="sm"
      variant={isActivity ? "destructive" : "secondary"}
      disabled={isLoading}
      onClick={() => mutate({ goodsId, status: !isActivity })}
    >
      {isActivity ? "下架" : "上架"}
    </Button>
  );
}
