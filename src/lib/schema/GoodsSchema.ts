import { z } from "zod";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { goods } from "@/server/db/schema";
export const EditGoodsSchema = z.object({
  name: z.string().min(1, "用户名不能为空").max(30, "用户名不能超过30个字符"),
  description: z.string().max(100, "不能超过100个字符").nullable(),
  cover: z.string().nullable(),
});


export type EditGoodsType = z.infer<typeof EditGoodsSchema>


const selectUserSchema = createSelectSchema(goods);
export type SelectGoodsType = z.infer<typeof selectUserSchema>