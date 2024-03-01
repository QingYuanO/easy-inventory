import Header from "@/components/Header";
import EditUserForm from "@/components/EditUserForm";
import React from "react";

export default function Page() {
  return (
    <div className="py-14">
      <Header title="创建用户" isBack />
      <div className="p-4">
        <EditUserForm type="create" />
      </div>
    </div>
  );
}
