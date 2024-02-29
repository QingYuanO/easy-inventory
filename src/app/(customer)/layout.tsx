import React from "react";
import CustomerTabBar from "./_components/CustomerTabBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <CustomerTabBar />
    </div>
  );
}
