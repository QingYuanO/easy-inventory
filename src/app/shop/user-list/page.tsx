import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/server";
import { Ghost } from "lucide-react";
import SwitchActivityButton from "./_components/SwitchActivityButton";

export default async function Page() {
  const result = await api.user.getUsersByShop.query(undefined, {
    context: { next: { tags: ["getUsersByShop"] } },
  });
  console.log(result);
  
  return (
    <div className="py-12">
      <Header title="用户列表" isBack />
      {result && result.length > 0 ? (
        <div className="flex flex-col gap-4 p-4">
          {result.map((user) => (
            <Card
              key={user.id}
              className="col-span-1 flex flex-col justify-between"
            >
              <CardHeader className="p-4 pb-2">
                <CardTitle>{user.name}</CardTitle>
                <CardDescription className="w-full">
                  {user.account}
                </CardDescription>
              </CardHeader>
              {/* <CardContent></CardContent> */}
              <CardFooter className="flex justify-between px-4 pb-4">
                <Button size="sm" variant="default" asChild>
                  <a href={`tel:${user.phone}`}>拨打电话</a>
                </Button>
                <div className="flex gap-3">
                  <SwitchActivityButton isActivity={user.isActivity} userId={user.id!} />
                  {/* <Button size="sm" variant="secondary">
                    修改
                  </Button> */}
                  <Button size="sm" variant="default">
                    查看
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center gap-2">
          <Ghost className="size-8 text-zinc-800" />
          <h3 className="text-xl font-semibold">你还没有客户</h3>
          <p className="">快点邀请吧</p>
        </div>
      )}
    </div>
  );
}
