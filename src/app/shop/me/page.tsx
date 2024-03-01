import LogoutButton from "@/components/LogoutButton";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import { ChevronRight, Smartphone, Store } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function Page() {
  const session = await getServerAuthSession();
  const user = session?.user;
  return (
    <div className="flex flex-col">
      <div className="space-y-2 border-b border-border p-4">
        <p className="flex items-center gap-2 text-xl font-bold">
          <Store />
          {user?.name}
        </p>
        <p className="flex items-center gap-2">
          <Smartphone className="size-4" />
          {user?.phone}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 p-4">
        <Card className="col-span-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>创建用户</CardTitle>
            <CardDescription>为客户创建账号在你的商场下单</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/shop/invite-user"
              className={buttonVariants({ variant: "secondary" })}
            >
              立即创建 <ChevronRight />
            </Link>
          </CardContent>
        </Card>
        <Card className="col-span-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>我的商品</CardTitle>
            <CardDescription className="w-full">
              管理商品，删除、添加等
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/shop/goods"
              className={buttonVariants({ variant: "secondary" })}
            >
              立即前往 <ChevronRight />
            </Link>
          </CardContent>
        </Card>
        <Card className="col-span-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>用户列表</CardTitle>
            <CardDescription className="w-full">
              查看所有用户及其对应的清单
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/shop/user-list"
              className={buttonVariants({ variant: "secondary" })}
            >
              立即查看 <ChevronRight />
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 flex justify-center p-4">
        <LogoutButton />
      </div>
    </div>
  );
}
