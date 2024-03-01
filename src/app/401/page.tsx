import { buttonVariants } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import { ChevronLeft, XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const session = await getServerAuthSession();
  if (!session) redirect("/sign-in");
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-2 mb-24">
        <XCircle className="size-20  text-red-400" />
        <p>您没有权限访问</p>
        <Link
          href={session?.user.type === "shop" ? "/shop" : "/"}
          className={buttonVariants({
            variant: "secondary",
          })}
        >
          <ChevronLeft className="mr-1 size-4" />
          返回
        </Link>
      </div>
    </div>
  );
}
