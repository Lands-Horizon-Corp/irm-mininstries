CREATE TABLE "minister_case_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"minister_id" integer NOT NULL,
	"description" text NOT NULL,
	"year" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "minister_case_reports" ADD CONSTRAINT "minister_case_reports_minister_id_ministers_id_fk" FOREIGN KEY ("minister_id") REFERENCES "public"."ministers"("id") ON DELETE no action ON UPDATE no action;