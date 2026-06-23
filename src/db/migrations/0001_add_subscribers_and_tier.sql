CREATE TABLE "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"status" varchar(12) DEFAULT 'active' NOT NULL,
	"source" varchar(40),
	"unsubscribe_token" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "tier" varchar(10) DEFAULT 'free' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_subscribers_email" ON "subscribers" USING btree ("email");--> statement-breakpoint
ALTER TABLE "subscribers" ENABLE ROW LEVEL SECURITY;