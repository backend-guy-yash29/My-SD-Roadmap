ALTER TABLE "roadmaps" ADD COLUMN "menu" text;--> statement-breakpoint
ALTER TABLE "roadmaps" ADD COLUMN "menu_note" text;--> statement-breakpoint
ALTER TABLE "roadmaps" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "roadmaps" ADD COLUMN "tagline" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "daily_goal" integer DEFAULT 5 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_daily_goal_range" CHECK ("users"."daily_goal" BETWEEN 1 AND 50);