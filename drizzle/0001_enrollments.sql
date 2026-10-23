CREATE TABLE "enrollments" (
	"user_id" text NOT NULL,
	"roadmap_id" text NOT NULL,
	"enrolled_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "enrollments_user_id_roadmap_id_pk" PRIMARY KEY("user_id","roadmap_id")
);
--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_roadmap_id_roadmaps_id_fk" FOREIGN KEY ("roadmap_id") REFERENCES "public"."roadmaps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- Enroll existing users in every roadmap they already have progress or notes in.
INSERT INTO "enrollments" ("user_id", "roadmap_id", "enrolled_at")
SELECT a."user_id", i."roadmap_id", min(a."at")
FROM (
  SELECT "user_id", "item_id", "updated_at" AS "at" FROM "user_item_progress" WHERE "is_done"
  UNION ALL
  SELECT "user_id", "item_id", "updated_at" FROM "notes"
) a
JOIN "items" i ON i."id" = a."item_id"
GROUP BY a."user_id", i."roadmap_id"
ON CONFLICT DO NOTHING;
