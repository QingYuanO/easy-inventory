import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type SelectInventoryType } from "./schema/InventorySchema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInventoryStatusText(status: SelectInventoryType["status"]) {
  switch (status) {
    case "PROGRESS":
      return "进行中";
    case "DONE":
      return "已完成";
    case "REFUSE":
      return "已拒绝";
    case "WAIT":
      return "待处理";
  }
}

export function getInventoryStatusColor(status: SelectInventoryType["status"]) {
  switch (status) {
    case "PROGRESS":
      return "#60a5fa";
    case "DONE":
      return "#4ade80";
    case "REFUSE":
      return "#f87171";
    case "WAIT":
      return "#fbbf24";
  }
}
