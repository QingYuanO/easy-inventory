import EditGoodsForm from "@/components/EditGoodsForm";
import Header from "@/components/Header";
import React from "react";

export default function Page({
  searchParams,
}: {
  searchParams: { type: "create" | "update"; goodsId?: string };
}) {

  const title = {
    create: "创建商品",
    update: "修改商品",
  }[searchParams.type];
  return (
    <div className="pt-12">
      <Header title={title} isBack />
      <div className="p-4">
        <EditGoodsForm
          type={searchParams.type}
          goodsId={searchParams.goodsId}
        />
      </div>
    </div>
  );
}
