CREATE TABLE "alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"soldier_id" integer NOT NULL,
	"level" varchar(50),
	"message" varchar(500),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "health_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"soldier_id" integer NOT NULL,
	"heart_rate" integer,
	"spo2" integer,
	"temperature" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "soldiers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"unit" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
