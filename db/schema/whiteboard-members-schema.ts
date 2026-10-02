import {
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { whiteboard } from "./whiteboards-schema";

/**
 * DATABASE-LEVEl ENUM
 * WHITEBOARD ROLE ENUM :
 * - OWNER
 * - EDITOR
 * - VIEWER
 */

export const whiteboardRoleEnum = pgEnum("whiteboard_role", [
  "owner",
  "editor",
  "viewer",
]);

export const whiteboardMembers = pgTable(
  "whiteboard_members",
  {
    role: whiteboardRoleEnum().notNull().default("editor"),

    whiteboardId: uuid("whiteboard_id")
      .notNull()
      .references(() => whiteboard.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),

    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  /**
   * COMPOSITE PRIMARY KEY
   * IDENTIFIES TABLE BASED ON MULTIPLE FIELDS
   */
  (table) => [
    primaryKey({
      columns: [table.userId, table.whiteboardId],
    }),
    index("whiteboard_members_whiteboard_id_idx").on(table.whiteboardId),
  ]
);
