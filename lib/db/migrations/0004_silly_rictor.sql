CREATE TABLE "church_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"longitude" text NOT NULL,
	"latitude" text NOT NULL,
	"address" text NOT NULL,
	"email" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
