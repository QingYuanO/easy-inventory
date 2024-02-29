import Header from "@/components/Header";
import UpdateUserForm from "@/components/UpdateUserForm";
import React from "react";

export default function Page() {
  return (
    <div className="py-12">
      <Header title="创建用户" isBack />
      <div className="p-4">
        <UpdateUserForm type="create" />
      </div>
    </div>
  );
}
