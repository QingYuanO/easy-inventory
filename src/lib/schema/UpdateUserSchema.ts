import { z } from "zod";
import { alphanumericRegex, phoneRegex } from "../regExp";

export const UpdateUserSchema = z.object({
  phone: z
    .string()
    .min(1, "手机号不能为空")
    .regex(phoneRegex, "请输入正确的手机号!"),
  name: z.string().min(1, "用户名不能为空").max(10, "用户名不能超过10个字符"),
  account: z
    .string()
    .min(1, "账号不能为空")
    .max(20, "账号不能超过20个字符")
    .regex(alphanumericRegex, "只能输入数字和字母!"),
});
