"use client";
import React from "react";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { phoneRegex } from "@/lib/regExp";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import { revalidatePath } from "next/cache";

const InviteUserFormSchema = z.object({
  phone: z.string().regex(phoneRegex, "请输入正确的手机号!"),
  name: z.string().min(1, "用户名不能为空"),
});

export default function InviteUserForm() {
  const router = useRouter();
  const { mutate, isLoading } = api.user.create.useMutation({
    onSuccess() {
      toast({
        description: "创建成功",
        variant: "default",
      });
      
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
  const form = useForm<z.infer<typeof InviteUserFormSchema>>({
    resolver: zodResolver(InviteUserFormSchema),
    defaultValues: {
      phone: "",
      name: "",
    },
  });
  const { toast } = useToast();
  const onSubmit = async (values: z.infer<typeof InviteUserFormSchema>) => {
    console.log(values);
    mutate({
      name: values.name,
      phone: values.phone,
    });
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-2">
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
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入用户名" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="mt-6 w-full" type="submit" disabled={isLoading}>
            创建
          </Button>
        </form>
      </Form>
    </div>
  );
}
