import Header from "@/components/Header";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { api } from "@/trpc/server";
import { Link, ChevronRight } from "lucide-react";
import React from "react";

export default async function Page() {
  const result = await api.user.getUsersByShop.query();
  console.log(result);

  return (
    <div className="py-12">
      <Header title="用户列表" isBack />
      <div className="flex flex-col gap-4 p-4">
        {result.map((user) => (
          <Card
            key={user.id}
            className="col-span-1 flex flex-col justify-between"
          >
            <CardHeader className="p-4 pb-2">
              <CardTitle>{user.name}</CardTitle>
              <CardDescription className="w-full">{user.phone}</CardDescription>
            </CardHeader>
            {/* <CardContent></CardContent> */}
            <CardFooter className="flex justify-between px-4 pb-4">
              <Button size="sm" variant="default">
                拨打电话
              </Button>
              <div className="flex gap-3">
                <Button size="sm" variant="destructive">
                  停用
                </Button>
                <Button size="sm" variant="secondary">
                  修改
                </Button>
                <Button size="sm" variant="default">
                  查看
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
