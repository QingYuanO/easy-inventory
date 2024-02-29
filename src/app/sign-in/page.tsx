"use client";

import React from "react";

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
import { genSaltSync, hashSync } from "bcryptjs";
import { phoneRegex } from "@/lib/regExp";

const SignInSchema = z
  .object({
    phone: z.string().regex(phoneRegex, "请输入正确的手机号!"),
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

function hashPassword(password: string) {
  // 使用bcryptjs对密码进行哈希处理
  const salt = genSaltSync(10);
  const hashedPassword = hashSync(password, salt);
  console.log(hashedPassword);

  return hashedPassword;
}

export default function Page() {
  // useEffect(() => {
  //   hashPassword('123456')
  // }, []);

  const router = useRouter();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      phone: "",
      type: "user",
      password: "",
    },
  });
  const { toast } = useToast();
  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    const signInData = await signIn("credentials", {
      ...values,
      redirect: false,
    });
    console.log(signInData);

    if (signInData?.error) {
      console.error(signInData.error);
      toast({
        // title: "登录失败",
        description: signInData.error,
        variant: "destructive",
      });
    } else {
      if (values.type === "shop") {
        router.replace("/shop");
      } else {
        router.replace("/");
      }
    }
  };
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4">
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
          <Button className="mt-6 w-full" type="submit">
            登录
          </Button>
        </form>
      </Form>
    </div>
  );
}
