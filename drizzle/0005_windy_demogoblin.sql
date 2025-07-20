CREATE TABLE "invoice_sequence" (
	"id" serial PRIMARY KEY NOT NULL,
	"current_number" integer DEFAULT 0 NOT NULL,
	"year" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invoice_sequence_year_unique" UNIQUE("year")
);
--> statement-breakpoint
CREATE INDEX "invoice_sequence_year_idx" ON "invoice_sequence" USING btree ("year");