"use client";

import { revalidateUserList } from "@/app/shop/user-list/action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { UpdateUserSchema } from "@/lib/schema/UpdateUserSchema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface UpdateUserFormProps {
  type: "edit" | "create";
  initData?: {
    phone: string;
    name: string;
    account: string;
  };
}

export default function UpdateUserForm({
  type,
  initData,
}: UpdateUserFormProps) {
  const router = useRouter();
  const createMutation = api.user.create.useMutation({
    async onSuccess() {
      toast({
        description: "创建成功",
        variant: "default",
      });
      // router.refresh();
      await revalidateUserList();
      setTimeout(() => {
        router.back();
      }, 500);
    },
    onError(error) {
      toast({
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: initData
      ? initData
      : {
          phone: "",
          name: "",
          account: "",
        },
  });
  const { toast } = useToast();
  const onSubmit = async (values: z.infer<typeof UpdateUserSchema>) => {
    console.log(values);
    if (type === "create") {
      createMutation.mutate({
        ...values,
      });
    }
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>账号</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入账号" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>建议姓+电话号码的组合</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>手机号</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入手机号" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入姓名" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className="mt-6 w-full"
            type="submit"
            disabled={type === "create" ? createMutation.isLoading : false}
          >
            创建
          </Button>
        </form>
      </Form>
    </div>
  );
}
