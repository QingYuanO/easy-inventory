"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import React from "react";
import { useToast } from "@/components/ui/use-toast";

interface SwitchActivityButtonProps {
  isActivity: boolean;
  userId: string;
}
export default function SwitchActivityButton({
  isActivity,
  userId,
}: SwitchActivityButtonProps) {
  const utils = api.useUtils();
  const { toast } = useToast();
  const { mutate, isLoading } = api.user.switchUserActivity.useMutation({
    async onSuccess() {
      await utils.user.getUsersByShop.invalidate();
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
      onClick={() => mutate({ userId, status: !isActivity })}
    >
      {isActivity ? "停用" : "启用"}
    </Button>
  );
}
