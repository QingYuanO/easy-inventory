"use client";
import EditInventoryForm from "@/components/EditInventoryForm";
import Header from "@/components/Header";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Page({
  searchParams,
}: {
  searchParams: { type: "create" | "update" | "view"; id: string };
}) {
  const type = searchParams.type;

  if (!type) return null;
  const title = {
    create: "创建清单",
    update: "修改清单",
    view: "清单详情",
  }[type];
  return (
    <div className="pt-14">
      <Header
        title={title}
        isBack
        rightContent={
          type === "update" && (
            <Link
              href={`/inventories/add-goods?id=${searchParams.id}`}
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              添加商品
            </Link>
          )
        }
      />
      <div className="p-4">
        <EditInventoryForm type={type} id={searchParams.id} />
      </div>
    </div>
  );
}
