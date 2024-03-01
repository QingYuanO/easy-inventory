"use client";
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
import {
  EditGoodsSchema,
  type EditGoodsType,
} from "@/lib/schema/GoodsSchema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { Textarea } from "./ui/textarea";
import { useEffect } from "react";

interface EditGoodsFormProps {
  type: "update" | "create";
  goodsId?: string;
}

export default function EditGoodsForm({ type, goodsId }: EditGoodsFormProps) {
  const utils = api.useUtils();
  const router = useRouter();
  const form = useForm<z.infer<typeof EditGoodsSchema>>({
    resolver: zodResolver(EditGoodsSchema),
    defaultValues: {
      description: "",
      name: "",
      cover: "",
    },
  });
  const { toast } = useToast();
  const { data: initData } = api.goods.getSingleGoods.useQuery(
    { goodsId: goodsId! },
    { enabled: !!goodsId, refetchOnWindowFocus: false },
  );

  useEffect(() => {
    if (initData) {
      form.setValue("name", initData?.name);
      form.setValue("description", initData?.description);
      form.setValue("cover", initData?.cover);
    }
  }, [initData, form]);

  const createMutation = api.goods.create.useMutation({
    async onSuccess() {
      toast({
        description: "创建成功",
        variant: "default",
        duration: 2000,
      });
      await utils.goods.getGoodsByShop.invalidate();
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

  const updateMutation = api.goods.update.useMutation({
    async onSuccess() {
      toast({
        description: "修改成功",
        variant: "default",
      });
      await utils.goods.getGoodsByShop.invalidate();
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

  const onSubmit = async (values: z.infer<typeof EditGoodsSchema>) => {
    console.log(values);
    if (type === "create") {
      createMutation.mutate({
        ...values,
      });
    }
    if (type === "update" && goodsId) {
      updateMutation.mutate({
        ...values,
        goodsId,
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名称</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="请输入描述"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className="mt-6 w-full"
            type="submit"
            disabled={
              type === "create"
                ? createMutation.isLoading
                : updateMutation.isLoading
            }
          >
            {type === "create" ? "创建" : "修改"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
