import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

/**
 * DATABASE-LEVEl ENUM
 * BACKGROUND TYPE ENUM :
 * - DOTS
 * - GRID
 * - PLAIN
 */

export const backgroundPatternEnum = pgEnum("background_pattern", [
  "dots",
  "grid",
  "plain",
]);

export const whiteboard = pgTable(
  "whiteboard",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    description: varchar("description", { length: 1000 }),
    backgroundPattern: backgroundPatternEnum().default("dots").notNull(),
    bgColor: text("bg_color").notNull().default("#ffffff"),

    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("whiteboard_owner_id_idx").on(table.ownerId)]
);
