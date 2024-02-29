"use client";
import Link from "next/link";
import React from "react";

import { Store, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function CustomerTabBar() {
  const pathname = usePathname();

  if (!["/", "/me"].includes(pathname ?? "")) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 flex h-12 items-center justify-around border-t border-border text-sm text-zinc-400 ">
      <Link
        href="/"
        className={buttonVariants({
          variant: "ghost",
          className: cn(pathname === "/" && "text-foreground"),
        })}
      >
        <Store className="mr-0.5 size-4" />
        商品
      </Link>
      <Link
        href="/me"
        className={buttonVariants({
          variant: "ghost",
          className: cn(pathname === "/me" && "text-foreground"),
        })}
      >
        <UserRound className="mr-0.5 size-4" />
        我的
      </Link>
    </div>
  );
}
