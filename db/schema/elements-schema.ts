import {
  decimal,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { whiteboard } from "./whiteboards-schema";

/**
 * DATABASE-LEVEl ENUM
 * BACKGROUND TYPE ENUM :
 * - DOTS
 * - GRID
 * - PLAIN
 */

export const elementTypeEnum = pgEnum("element_type", [
  "shape",
  "text",
  "image",
]);

export const elements = pgTable(
  "elements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: elementTypeEnum().notNull(),
    data: jsonb("data").notNull().default({}),
    z: integer("z").notNull().default(1000),

    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "set null" }),
    whiteboardId: uuid("whiteboard_id")
      .notNull()
      .references(() => whiteboard.id),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("elements_whiteboard_id_idx").on(table.whiteboardId)]
);

// TODO RELATIONS
