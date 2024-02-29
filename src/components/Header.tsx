"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface HeaderProps {
  title: string;
  isBack?: boolean;
}

export default function Header({ title, isBack }: HeaderProps) {
  const router = useRouter();
  return (
    <div className="fixed left-0 right-0 top-0 flex h-12 items-center justify-center border-b border-border text-base">
      {isBack && (
        <ArrowLeft
          className="absolute left-4 top-1/2 -translate-y-1/2 size-5"
          onClick={() => router.back()}
        />
      )}
      <span>{title}</span>
    </div>
  );
}
