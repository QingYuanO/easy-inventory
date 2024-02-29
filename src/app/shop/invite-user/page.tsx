import Header from "@/components/Header";
import React from "react";
import InviteUserForm from "../_components/InviteUserForm";

export default function Page() {
  return (
    <div className="py-12">
      <Header title="创建用户" isBack />
      <div className="p-4">
        <InviteUserForm />
      </div>
    </div>
  );
}
