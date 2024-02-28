import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  union,
  unique,
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

export const roles = pgEnum("sgl_role", ["user", "admin"]);

export const shops = createTable("shop", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 11 }).notNull(),
  password: text("password").notNull(),
  ...baseColumn,
});

export const shopRelations = relations(shops, ({ many }) => ({
  usersToShops: many(usersToShops),
}));

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 11 }).notNull(),
  ...baseColumn,
});

export const userRelations = relations(users, ({ many }) => ({
  usersToShops: many(usersToShops),
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
