import { inventories } from "@/server/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const selectInventorySchema = createSelectSchema(inventories);
export type SelectInventoryType = z.infer<typeof selectInventorySchema>;
