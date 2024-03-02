"use client";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import React, { type PropsWithChildren } from "react";

export default function SignOutWrap({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn(className)} onClick={() => signOut()}>
      {children}
    </div>
  );
}
