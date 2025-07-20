CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled');--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "due_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "client_phone" varchar(30);--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "service_type" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "status" "invoice_status" DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "payment_terms" varchar(50) DEFAULT '30';--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "payment_method" varchar(100);