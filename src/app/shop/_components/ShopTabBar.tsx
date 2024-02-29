"use client";
import Link from "next/link";
import React from "react";

import { ClipboardList, UserRound } from "lucide-react";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function ShopTabBar() {
  // const path = useSelectedLayoutSegment();
  const pathname = usePathname();
  // console.log(path);
  // console.log(pathname);

  if (!["/shop", "/shop/me"].includes(pathname ?? "")) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 flex h-12 items-center justify-around border-t border-border text-sm text-zinc-400 ">
      <Link
        href="/shop"
        className={buttonVariants({
          variant: "ghost",
          className: cn(pathname === "/shop" && "text-foreground"),
        })}
      >
        <ClipboardList className="mr-0.5 size-4" />
        清单
      </Link>
      <Link
        href="/shop/me"
        className={buttonVariants({
          variant: "ghost",
          className: cn(pathname === "/shop/me" && "text-foreground"),
        })}
      >
        <UserRound className="mr-0.5 size-4" />
        我的
      </Link>
    </div>
  );
}
