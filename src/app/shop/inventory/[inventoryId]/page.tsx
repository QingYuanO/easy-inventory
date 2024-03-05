"use client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export default function Page() {
  const params = useParams();
  const { data, isLoading, isError, error } = api.inventory.get.useQuery(
    {
      id: params.inventoryId as string,
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
      enabled: !!params.inventoryId,
    },
  );
  const router = useRouter();
  return (
    <div className="py-14">
      <Header title={data?.name ?? "XXX"} isBack />
      {isLoading ? (
        <div className="mt-20 flex items-center justify-center">
          <Loader2 className="size-6 animate-spin" />
          <p className="text-sm">加载中...</p>
        </div>
      ) : isError ? (
        <div className="mt-28 flex flex-col items-center gap-4">
          <p>{error.message}</p>
          <Button variant={"default"} onClick={() => router.back()}>
            返回
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <div className="text-lg">商品</div>
            <div className="grid grid-cols-2 gap-4 ">
              {data?.goodsToInventories.map((item) => (
                <div
                  key={item.goods.id}
                  className="col-span-2 flex flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow print:col-span-1 print:shadow-none"
                >
                  <div className="flex items-center justify-between gap-1">
                    <p className="text font-bold">{item.goods.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.num}件
                    </p>
                  </div>
                  <div className="">
                    <div className="text-sm text-foreground">
                      备注：{item.memo ? item.memo : "-"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {data.memo && (
            <div className="flex flex-col gap-2">
              <div className="text-lg">备注</div>
              <div className="col-span-2 flex flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow print:shadow-none">
                {data.memo}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
