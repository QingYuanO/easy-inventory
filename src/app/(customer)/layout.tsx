import React from "react";
import CustomerTabBar from "./_components/CustomerTabBar";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session) redirect("/sign-in");
  if (session.user.type === "shop") redirect("/401");
  return (
    <div>
      {children}
      <CustomerTabBar />
    </div>
  );
}
