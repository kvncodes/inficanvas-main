CREATE TYPE "public"."element_type" AS ENUM('shape', 'text', 'image');--> statement-breakpoint
CREATE TYPE "public"."whiteboard_role" AS ENUM('owner', 'editor', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."background_pattern" AS ENUM('dots', 'grid', 'plain');--> statement-breakpoint
CREATE TABLE "elements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "element_type" NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"z" integer DEFAULT 1000 NOT NULL,
	"created_by" text NOT NULL,
	"whiteboard_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "whiteboard_members" (
	"role" "whiteboard_role" DEFAULT 'editor' NOT NULL,
	"whiteboard_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "whiteboard_members_user_id_whiteboard_id_pk" PRIMARY KEY("user_id","whiteboard_id")
);
--> statement-breakpoint
CREATE TABLE "whiteboard" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar(1000),
	"backgroundPattern" "background_pattern" DEFAULT 'dots' NOT NULL,
	"bg_color" text DEFAULT '#ffffff' NOT NULL,
	"owner_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "elements" ADD CONSTRAINT "elements_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "elements" ADD CONSTRAINT "elements_whiteboard_id_whiteboard_id_fk" FOREIGN KEY ("whiteboard_id") REFERENCES "public"."whiteboard"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whiteboard_members" ADD CONSTRAINT "whiteboard_members_whiteboard_id_whiteboard_id_fk" FOREIGN KEY ("whiteboard_id") REFERENCES "public"."whiteboard"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whiteboard_members" ADD CONSTRAINT "whiteboard_members_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whiteboard" ADD CONSTRAINT "whiteboard_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "elements_whiteboard_id_idx" ON "elements" USING btree ("whiteboard_id");--> statement-breakpoint
CREATE INDEX "whiteboard_members_whiteboard_id_idx" ON "whiteboard_members" USING btree ("whiteboard_id");--> statement-breakpoint
CREATE INDEX "whiteboard_owner_id_idx" ON "whiteboard" USING btree ("owner_id");