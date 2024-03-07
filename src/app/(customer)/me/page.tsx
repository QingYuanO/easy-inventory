import LogoutButton from "@/components/LogoutButton";
import SignOutWrap from "@/components/SignOutWrap";
import { getServerAuthSession } from "@/server/auth";
import { ArrowRight, ChevronRight, Smartphone, User } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function Page() {
  const session = await getServerAuthSession();
  const user = session?.user;
  return (
    <div className="flex flex-col">
      <div className="space-y-2 border-b border-border p-4">
        <p className="flex items-center gap-2 text-xl font-bold">
          <User />
          {user?.name}
        </p>
        <p className="flex items-center gap-2">
          <Smartphone className="size-4" />
          {user?.phone}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-4 p-4">
        <Link
          href="inventories"
          className="flex items-center justify-between rounded border border-border p-4"
        >
          <div>我的清单</div>
          <ChevronRight />
        </Link>
        <Link
          href="/shop-list"
          className="flex items-center justify-between rounded border border-border p-4"
        >
          <div>店铺列表</div>
          <ChevronRight />
        </Link>
        <SignOutWrap className="flex items-center justify-between rounded border border-border p-4">
          <div>退出登录</div>
          <ChevronRight />
        </SignOutWrap>
      </div>
    </div>
  );
}
