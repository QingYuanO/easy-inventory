"use client";

import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { alphanumericRegex } from "@/lib/regExp";

const SignInSchema = z
  .object({
    account: z.string().regex(alphanumericRegex, "请输入正确的账号!"),
    type: z.enum(["user", "shop"]).default("user"),
    password: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "shop" && !data.password) {
      ctx.addIssue({
        code: "custom",
        message: "请输入密码",
        path: ["password"],
      });
    }
  });

export default function Page() {
  const router = useRouter();

  // const lastLoginUser = window.localStorage?.getItem("lastLoginUser") ?? "";

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      account: "",
      type: "user",
      password: "",
    },
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    setIsLoading(true);
    const signInData = await signIn("credentials", {
      ...values,
      redirect: false,
    });
    setIsLoading(false);
    if (signInData?.error) {
      console.error(signInData.error);
      toast({
        // title: "登录失败",
        description: signInData.error,
        variant: "destructive",
      });
    } else {
      localStorage.setItem("lastLoginUser", values.account);
      if (values.type === "shop") {
        router.replace("/shop");
      } else {
        router.replace("/");
      }
    }
  };
  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-10 px-8 py-20">
      <div className=" flex flex-col items-center gap-4">
        <p className="text-2xl font-semibold">Easy 清单</p>
        <p className="text-muted-foreground">易于使用的货物配送清单管理工具</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full rounded border border-border px-8 py-10"
        >
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
                </FormItem>
              )}
            />
            {form.getValues("type") === "shop" && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入密码"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>登录方式</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择登录方式" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">用户</SelectItem>
                      <SelectItem value="shop">商家</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="mt-6 w-full" type="submit" disabled={isLoading}>
            登录
          </Button>
        </form>
      </Form>
    </div>
  );
}
