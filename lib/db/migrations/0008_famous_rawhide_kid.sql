CREATE TABLE "member_awards_recognitions" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" serial NOT NULL,
	"year" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member_children" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" serial NOT NULL,
	"name" text NOT NULL,
	"place_of_birth" text NOT NULL,
	"date_of_birth" timestamp NOT NULL,
	"gender" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member_education_backgrounds" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" serial NOT NULL,
	"school_name" text NOT NULL,
	"educational_attainment" text NOT NULL,
	"date_graduated" timestamp,
	"description" text,
	"course" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member_emergency_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" serial NOT NULL,
	"name" text NOT NULL,
	"relationship" text NOT NULL,
	"address" text NOT NULL,
	"contact_number" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member_employment_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" serial NOT NULL,
	"company_name" text NOT NULL,
	"from_year" text NOT NULL,
	"to_year" text,
	"position" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member_ministry_experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" serial NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"from_year" text NOT NULL,
	"to_year" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member_ministry_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" serial NOT NULL,
	"church_location_id" serial NOT NULL,
	"from_year" text NOT NULL,
	"to_year" text,
	"contribution" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member_ministry_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" serial NOT NULL,
	"ministry_skill_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member_seminars_conferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" serial NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"place" text,
	"year" text NOT NULL,
	"number_of_hours" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"middle_name" text,
	"suffix" text,
	"nickname" text,
	"date_of_birth" timestamp NOT NULL,
	"place_of_birth" text NOT NULL,
	"address" text NOT NULL,
	"gender" text NOT NULL,
	"height_feet" text NOT NULL,
	"weight_kg" text NOT NULL,
	"civil_status" text NOT NULL,
	"email" text,
	"telephone" text,
	"passport_number" text,
	"sss_number" text,
	"philhealth" text,
	"tin" text,
	"present_address" text NOT NULL,
	"permanent_address" text,
	"father_name" text NOT NULL,
	"father_province" text NOT NULL,
	"father_birthday" timestamp NOT NULL,
	"father_occupation" text NOT NULL,
	"mother_name" text NOT NULL,
	"mother_province" text NOT NULL,
	"mother_birthday" timestamp NOT NULL,
	"mother_occupation" text NOT NULL,
	"spouse_name" text,
	"spouse_province" text,
	"spouse_birthday" timestamp,
	"spouse_occupation" text,
	"wedding_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"skills" text,
	"hobbies" text,
	"sports" text,
	"other_religious_secular_training" text,
	"certified_by" text,
	"signature_image_url" text,
	"signature_by_certified_image_url" text,
	"image_url" text
);
--> statement-breakpoint
ALTER TABLE "member_awards_recognitions" ADD CONSTRAINT "member_awards_recognitions_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_children" ADD CONSTRAINT "member_children_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_education_backgrounds" ADD CONSTRAINT "member_education_backgrounds_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_emergency_contacts" ADD CONSTRAINT "member_emergency_contacts_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_employment_records" ADD CONSTRAINT "member_employment_records_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_ministry_experiences" ADD CONSTRAINT "member_ministry_experiences_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_ministry_records" ADD CONSTRAINT "member_ministry_records_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_ministry_records" ADD CONSTRAINT "member_ministry_records_church_location_id_church_locations_id_fk" FOREIGN KEY ("church_location_id") REFERENCES "public"."church_locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_ministry_skills" ADD CONSTRAINT "member_ministry_skills_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_ministry_skills" ADD CONSTRAINT "member_ministry_skills_ministry_skill_id_ministry_skills_id_fk" FOREIGN KEY ("ministry_skill_id") REFERENCES "public"."ministry_skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member_seminars_conferences" ADD CONSTRAINT "member_seminars_conferences_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;