CREATE TABLE "user_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"email_notifications" boolean DEFAULT true,
	"push_notifications" boolean DEFAULT true,
	"desktop_notifications" boolean DEFAULT false,
	"invoice_reminders" boolean DEFAULT true,
	"consultation_alerts" boolean DEFAULT true,
	"marketing_emails" boolean DEFAULT false,
	"two_factor_enabled" boolean DEFAULT false,
	"login_alerts" boolean DEFAULT true,
	"session_timeout" integer DEFAULT 60,
	"theme" varchar(20) DEFAULT 'dark',
	"language" varchar(10) DEFAULT 'en',
	"timezone" varchar(50) DEFAULT 'Asia/Kolkata',
	"currency" varchar(10) DEFAULT 'INR',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
DROP TABLE "consultation_forms" CASCADE;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;