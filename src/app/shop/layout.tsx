import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import React, { type PropsWithChildren } from "react";
import ShopTabBar from "./_components/ShopTabBar";

export default async function ShopLayout({ children }: PropsWithChildren) {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/sign-in");
  if (session.user.type !== "shop") redirect("/401");

  return (
    <div >
      {children}
      <ShopTabBar />
    </div>
  );
}
