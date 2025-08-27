ALTER TABLE "ministry_skills" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "minister_ministry_experiences" ADD COLUMN "ministry_rank_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "minister_ministry_experiences" ADD CONSTRAINT "minister_ministry_experiences_ministry_rank_id_ministry_ranks_id_fk" FOREIGN KEY ("ministry_rank_id") REFERENCES "public"."ministry_ranks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minister_ministry_experiences" DROP COLUMN "title";