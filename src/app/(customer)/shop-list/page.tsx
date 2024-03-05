"use client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Ghost, Loader2 } from "lucide-react";
import SwitchSelectedButton from "./_components/SwitchSelectedButton";
import { cn } from "@/lib/utils";

export default function Page() {
  const { data, isLoading } = api.shop.getShopsByUser.useQuery();

  return (
    <div className="py-14">
      <Header title="店铺列表" isBack />

      {isLoading ? (
        <div>
          <div className="mt-20 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin" />
            <p className="text-sm">加载中...</p>
          </div>
        </div>
      ) : (
        <>
          {data && data.length > 0 ? (
            <div className="flex flex-col gap-4 p-4">
              {data.map((shop) => (
                <Card
                  key={shop.id}
                  className={cn(
                    "col-span-1 flex flex-col justify-between ",
                    shop.isSelected && " outline outline-foreground",
                  )}
                >
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="flex justify-between">
                      <span>{shop.name}</span>
                      {!shop.isActivity && (
                        <span className="text-red-400">已锁定</span>
                      )}
                    </CardTitle>
                    <CardDescription className="w-full">
                      {shop.description ?? "暂无描述"}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between px-4 pb-4">
                    <SwitchSelectedButton
                      isSelected={shop.isSelected}
                      shopId={shop.id!}
                    />
                    <div className="flex gap-3">
                      <Button size="sm" variant="default" asChild>
                        <a href={`tel:${shop.phone}`}>拨打电话</a>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-20 flex flex-col items-center gap-2">
              <Ghost className="size-8 text-zinc-800" />
              <h3 className="text-xl font-semibold">你还没有绑定商家</h3>
              <p className="">快点联系商家绑定吧</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
