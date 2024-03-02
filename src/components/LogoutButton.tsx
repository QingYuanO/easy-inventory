"use client";
import React from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function LogoutButton({ className }: { className?: string }) {
  return (
    <Button
      variant="link"
      className={cn("w-32 text-sm text-muted-foreground", className)}
      onClick={() => signOut()}
    >
      退出登录
    </Button>
  );
}
