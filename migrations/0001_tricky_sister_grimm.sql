ALTER TABLE "minister_awards_recognitions" ALTER COLUMN "minister_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "minister_awards_recognitions" ALTER COLUMN "year" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_children" ALTER COLUMN "minister_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "minister_children" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_children" ALTER COLUMN "place_of_birth" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_children" ALTER COLUMN "date_of_birth" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "minister_children" ALTER COLUMN "gender" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_education_backgrounds" ALTER COLUMN "minister_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "minister_education_backgrounds" ALTER COLUMN "school_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_education_backgrounds" ALTER COLUMN "educational_attainment" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_education_backgrounds" ALTER COLUMN "date_graduated" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "minister_education_backgrounds" ALTER COLUMN "course" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_emergency_contacts" ALTER COLUMN "minister_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "minister_emergency_contacts" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_emergency_contacts" ALTER COLUMN "relationship" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_emergency_contacts" ALTER COLUMN "address" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_emergency_contacts" ALTER COLUMN "contact_number" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_employment_records" ALTER COLUMN "minister_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "minister_employment_records" ALTER COLUMN "company_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_employment_records" ALTER COLUMN "from_year" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_employment_records" ALTER COLUMN "to_year" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_employment_records" ALTER COLUMN "to_year" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "minister_employment_records" ALTER COLUMN "position" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_ministry_experiences" ALTER COLUMN "minister_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "minister_ministry_experiences" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_ministry_experiences" ALTER COLUMN "from_year" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_ministry_experiences" ALTER COLUMN "to_year" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_ministry_records" ALTER COLUMN "minister_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "minister_ministry_records" ALTER COLUMN "church_location_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "minister_ministry_records" ALTER COLUMN "from_year" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_ministry_records" ALTER COLUMN "to_year" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_ministry_skills" ALTER COLUMN "minister_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "minister_ministry_skills" ALTER COLUMN "ministry_skill_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "minister_seminars_conferences" ALTER COLUMN "minister_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "minister_seminars_conferences" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_seminars_conferences" ALTER COLUMN "place" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_seminars_conferences" ALTER COLUMN "year" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "minister_seminars_conferences" ALTER COLUMN "number_of_hours" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "first_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "middle_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "last_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "date_of_birth" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "place_of_birth" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "gender" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "address" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "civil_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "father_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "father_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "father_occupation" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "father_occupation" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "mother_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "mother_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "mother_occupation" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "mother_occupation" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "spouse_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "spouse_occupation" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ministers" ALTER COLUMN "image_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "suffix" text;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "nickname" text;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "height_feet" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "weight_kg" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "telephone" text;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "passport_number" text;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "sss_number" text;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "philhealth" text;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "tin" text;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "present_address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "permanent_address" text;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "father_province" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "father_birthday" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "mother_province" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "mother_birthday" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "spouse_province" text;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "spouse_birthday" timestamp;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "wedding_date" timestamp;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "skills" text;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "hobbies" text;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "sports" text;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "other_religious_secular_training" text;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "certified_by" text;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "signature_image_url" text;--> statement-breakpoint
ALTER TABLE "ministers" ADD COLUMN "signature_by_certified_image_url" text;--> statement-breakpoint
ALTER TABLE "minister_ministry_records" ADD CONSTRAINT "minister_ministry_records_church_location_id_churches_id_fk" FOREIGN KEY ("church_location_id") REFERENCES "public"."churches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minister_ministry_skills" ADD CONSTRAINT "minister_ministry_skills_ministry_skill_id_ministry_skills_id_fk" FOREIGN KEY ("ministry_skill_id") REFERENCES "public"."ministry_skills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "contact_number";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "nationality";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "citizenship";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "spouse_date_of_birth";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "spouse_place_of_birth";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "spouse_nationality";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "spouse_citizenship";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "spouse_contact_number";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "spouse_email";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "ministry_status";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "role_in_church";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "current_church";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "home_church";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "conversion_date";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "water_baptism_date";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "holy_ghost_baptism_date";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "occupation";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "company_name";--> statement-breakpoint
ALTER TABLE "ministers" DROP COLUMN "year_started";