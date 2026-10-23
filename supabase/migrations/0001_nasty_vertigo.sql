CREATE TABLE "boards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "boards_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "branches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "branches_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"board_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "classes_board_id_slug_unique" UNIQUE("board_id","slug")
);
--> statement-breakpoint
CREATE TABLE "student_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"topic_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_slug_unique";--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "is_demo" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "student_subjects" ADD COLUMN "assigned_by" uuid;--> statement-breakpoint
ALTER TABLE "student_subjects" ADD COLUMN "revoked_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "student_subjects" ADD COLUMN "revoked_by" uuid;--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "class_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "branch_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "register_number" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "class_id" uuid;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_notes" ADD CONSTRAINT "student_notes_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_notes" ADD CONSTRAINT "student_notes_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "classes_board_id_idx" ON "classes" USING btree ("board_id");--> statement-breakpoint
CREATE INDEX "student_notes_student_topic_idx" ON "student_notes" USING btree ("student_id","topic_id");--> statement-breakpoint
ALTER TABLE "student_subjects" ADD CONSTRAINT "student_subjects_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_subjects" ADD CONSTRAINT "student_subjects_revoked_by_users_id_fk" FOREIGN KEY ("revoked_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "chapters_one_demo_per_subject_idx" ON "chapters" USING btree ("subject_id") WHERE "chapters"."is_demo" = true;--> statement-breakpoint
CREATE INDEX "subjects_class_id_idx" ON "subjects" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "users_branch_id_idx" ON "users" USING btree ("branch_id");--> statement-breakpoint
CREATE INDEX "users_class_id_idx" ON "users" USING btree ("class_id");--> statement-breakpoint
ALTER TABLE "student_subjects" DROP COLUMN "expires_at";--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_class_id_slug_unique" UNIQUE("class_id","slug");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_register_number_unique" UNIQUE("register_number");