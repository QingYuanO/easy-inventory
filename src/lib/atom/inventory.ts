import { atom } from "jotai";
import { atomWithStorage, RESET, splitAtom } from "jotai/utils";
import { type SelectGoodsType } from "../schema/GoodsSchema";

export type InventoryGoods = {
  num: number;
  memo?: string;
  goods: SelectGoodsType;
};
export const inventoryGoodsAtom = atomWithStorage<InventoryGoods[]>(
  "inventoryGoods",
  [],
);

export const inventoryMemoAtom = atom<string>("");
export const inventoryNameAtom = atom<string>("");

export const updateInventoryGoodsAtom = atom<InventoryGoods[]>([]);
export const updateInventoryGoodsAtomsAtom = splitAtom(
  updateInventoryGoodsAtom,
);
