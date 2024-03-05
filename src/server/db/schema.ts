import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `sgl_${name}`);

const baseColumn = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
};

export const shops = createTable("shop", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 11 }).notNull(),
  account: varchar("account", { length: 20 }).notNull().unique(),
  password: text("password").notNull(),
  description: text("description"),
  ...baseColumn,
});

export const shopRelations = relations(shops, ({ many }) => ({
  usersToShops: many(usersToShops),
  goods: many(goods),
  inventories: many(inventories),
}));

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 11 }).notNull(),
  account: varchar("account", { length: 20 }).notNull().unique(),
  ...baseColumn,
});

export const userRelations = relations(users, ({ many }) => ({
  usersToShops: many(usersToShops),
  inventories: many(inventories),
}));

export const usersToShops = createTable(
  "users_to_shops",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    shopId: varchar("shop_id", { length: 255 })
      .notNull()
      .references(() => shops.id),
    //账号是否被商家锁定
    isActivity: boolean("is_activity").notNull().default(true),
    isSelected: boolean("is_selected").notNull().default(false),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.shopId] }),
  }),
);

export const usersToShopsRelations = relations(usersToShops, ({ one }) => ({
  user: one(users, {
    fields: [usersToShops.userId],
    references: [users.id],
  }),
  shop: one(shops, {
    fields: [usersToShops.shopId],
    references: [shops.id],
  }),
}));

export const goods = createTable("goods", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  cursor: serial("cursor").notNull().unique(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  cover: varchar("cover", { length: 255 }),
  shopId: varchar("shop_id", { length: 255 }).notNull(),
  isActivity: boolean("is_activity").notNull().default(true),
  ...baseColumn,
});

export const goodsRelations = relations(goods, ({ one, many }) => ({
  shop: one(shops, {
    fields: [goods.shopId],
    references: [shops.id],
  }),
  goodsToInventories: many(goodsToInventories),
}));

export const inventoryEnum = pgEnum("status", [
  "PROGRESS",
  "DONE",
  "REFUSE",
  "WAIT",
]);


export const inventories = createTable("inventories", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  cursor: serial("cursor").notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  memo: text("memo"),
  shopId: varchar("shop_id", { length: 255 })
    .notNull()
    .references(() => shops.id),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  status: inventoryEnum("WAIT").notNull(),
  ...baseColumn,
});

export const inventoriesRelations = relations(inventories, ({ one, many }) => ({
  shop: one(shops, {
    fields: [inventories.shopId],
    references: [shops.id],
  }),
  user: one(users, {
    fields: [inventories.userId],
    references: [users.id],
  }),
  goodsToInventories: many(goodsToInventories),
}));

export const goodsToInventories = createTable("goods_to_inventories", {
  goodsId: varchar("goods_id", { length: 255 })
    .notNull()
    .references(() => goods.id),
  inventoryId: varchar("inventory_id", { length: 255 })
    .notNull()
    .references(() => inventories.id),
  num: integer("num").notNull(),
  memo: text("memo"),
});

export const goodsToInventoriesRelations = relations(
  goodsToInventories,
  ({ one }) => ({
    goods: one(goods, {
      fields: [goodsToInventories.goodsId],
      references: [goods.id],
    }),
    inventory: one(inventories, {
      fields: [goodsToInventories.inventoryId],
      references: [inventories.id],
    }),
  }),
);
