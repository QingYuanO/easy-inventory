"use client";
import React from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <Button variant="link" className="w-32 text-sm text-muted-foreground" onClick={() => signOut()}>
      退出登录
    </Button>
  );
}
