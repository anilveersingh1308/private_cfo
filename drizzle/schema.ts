import { pgTable, unique, serial, varchar, json, text, boolean, timestamp, numeric, integer, foreignKey, index, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const consultationStatus = pgEnum("consultation_status", ['scheduled', 'ongoing', 'completed', 'pending', 'cancelled'])
export const invoiceStatus = pgEnum("invoice_status", ['draft', 'sent', 'paid', 'overdue', 'cancelled'])
export const paymentStatus = pgEnum("payment_status", ['paid', 'pending', 'failed'])
export const subscriberStatus = pgEnum("subscriber_status", ['active', 'unsubscribed', 'bounced', 'pending'])
export const userRole = pgEnum("user_role", ['admin', 'consultant', 'moderator', 'user'])
export const userStatus = pgEnum("user_status", ['active', 'inactive', 'pending', 'suspended'])


export const adminSettings = pgTable("admin_settings", {
	id: serial().primaryKey().notNull(),
	settingKey: varchar("setting_key", { length: 100 }).notNull(),
	settingValue: json("setting_value"),
	description: text(),
	isPublic: boolean("is_public").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("admin_settings_setting_key_unique").on(table.settingKey),
]);

export const dashboardAnalytics = pgTable("dashboard_analytics", {
	id: serial().primaryKey().notNull(),
	metricName: varchar("metric_name", { length: 100 }).notNull(),
	metricValue: numeric("metric_value", { precision: 15, scale:  2 }).notNull(),
	metricType: varchar("metric_type", { length: 50 }).notNull(),
	periodStart: timestamp("period_start", { mode: 'string' }).notNull(),
	periodEnd: timestamp("period_end", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const consultations = pgTable("consultations", {
	id: serial().primaryKey().notNull(),
	clientName: varchar("client_name", { length: 255 }).notNull(),
	clientEmail: varchar("client_email", { length: 255 }).notNull(),
	serviceType: varchar("service_type", { length: 255 }).notNull(),
	status: consultationStatus().default('scheduled').notNull(),
	scheduledDate: timestamp("scheduled_date", { mode: 'string' }).notNull(),
	duration: integer().default(60).notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	paymentStatus: paymentStatus("payment_status").default('pending').notNull(),
	consultant: varchar({ length: 255 }),
	meetingLink: varchar("meeting_link", { length: 500 }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	name: varchar({ length: 255 }),
	phone: varchar({ length: 30 }),
	email: varchar({ length: 255 }),
	consultationFee: numeric("consultation_fee", { precision: 10, scale:  2 }),
	assignedTo: integer("assigned_to"),
	clientSatisfactionRating: integer("client_satisfaction_rating"),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	categories: json(),
	status: subscriberStatus().default('active').notNull(),
	engagementScore: integer("engagement_score").default(0),
	source: varchar({ length: 100 }),
	totalEmailsSent: integer("total_emails_sent").default(0),
	lastEmailOpened: timestamp("last_email_opened", { mode: 'string' }),
	subscribedAt: timestamp("subscribed_at", { mode: 'string' }).defaultNow().notNull(),
	unsubscribedAt: timestamp("unsubscribed_at", { mode: 'string' }),
}, (table) => [
	unique("newsletter_subscribers_email_unique").on(table.email),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	role: userRole().default('user').notNull(),
	status: userStatus().default('active').notNull(),
	phone: varchar({ length: 30 }),
	location: varchar({ length: 255 }),
	consultationsCount: integer("consultations_count").default(0),
	totalSpent: numeric("total_spent", { precision: 12, scale:  2 }).default('0'),
	lastLogin: timestamp("last_login", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	username: varchar({ length: 255 }),
	firstName: varchar("first_name", { length: 255 }),
	lastName: varchar("last_name", { length: 255 }),
	isActive: boolean("is_active").default(true),
	specialization: varchar({ length: 255 }),
	experienceYears: integer("experience_years"),
	bio: text(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const invoices = pgTable("invoices", {
	id: serial().primaryKey().notNull(),
	consultationId: integer("consultation_id"),
	invoiceNumber: varchar("invoice_number", { length: 50 }).notNull(),
	clientName: varchar("client_name", { length: 255 }).notNull(),
	clientEmail: varchar("client_email", { length: 255 }).notNull(),
	serviceDescription: text("service_description"),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	taxAmount: numeric("tax_amount", { precision: 10, scale:  2 }).default('0'),
	totalAmount: numeric("total_amount", { precision: 10, scale:  2 }).notNull(),
	paymentStatus: paymentStatus("payment_status").default('pending').notNull(),
	dueDate: timestamp("due_date", { mode: 'string' }).notNull(),
	paidDate: timestamp("paid_date", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	clientPhone: varchar("client_phone", { length: 30 }),
	serviceType: varchar("service_type", { length: 255 }).notNull(),
	status: invoiceStatus().default('draft').notNull(),
	paymentTerms: varchar("payment_terms", { length: 50 }).default('30'),
	paymentMethod: varchar("payment_method", { length: 100 }),
}, (table) => [
	foreignKey({
			columns: [table.consultationId],
			foreignColumns: [consultations.id],
			name: "invoices_consultation_id_consultations_id_fk"
		}),
	unique("invoices_invoice_number_unique").on(table.invoiceNumber),
]);

export const invoiceSequence = pgTable("invoice_sequence", {
	id: serial().primaryKey().notNull(),
	currentNumber: integer("current_number").default(0).notNull(),
	year: integer().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("invoice_sequence_year_idx").using("btree", table.year.asc().nullsLast().op("int4_ops")),
	unique("invoice_sequence_year_unique").on(table.year),
]);

export const consultationNotes = pgTable("consultation_notes", {
	id: serial().primaryKey().notNull(),
	consultationId: integer("consultation_id").notNull(),
	authorId: integer("author_id").notNull(),
	noteType: varchar("note_type", { length: 50 }).default('general').notNull(),
	title: varchar({ length: 255 }),
	content: text().notNull(),
	isPrivate: boolean("is_private").default(false),
	attachments: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.consultationId],
			foreignColumns: [consultations.id],
			name: "consultation_notes_consultation_id_consultations_id_fk"
		}),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [users.id],
			name: "consultation_notes_author_id_users_id_fk"
		}),
]);

export const consultationSessions = pgTable("consultation_sessions", {
	id: serial().primaryKey().notNull(),
	consultationId: integer("consultation_id").notNull(),
	advisorId: integer("advisor_id").notNull(),
	sessionType: varchar("session_type", { length: 50 }).default('video_call').notNull(),
	scheduledStart: timestamp("scheduled_start", { mode: 'string' }).notNull(),
	scheduledEnd: timestamp("scheduled_end", { mode: 'string' }).notNull(),
	actualStart: timestamp("actual_start", { mode: 'string' }),
	actualEnd: timestamp("actual_end", { mode: 'string' }),
	sessionStatus: varchar("session_status", { length: 50 }).default('scheduled').notNull(),
	meetingLink: varchar("meeting_link", { length: 500 }),
	sessionNotes: text("session_notes"),
	actionItems: json("action_items"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.consultationId],
			foreignColumns: [consultations.id],
			name: "consultation_sessions_consultation_id_consultations_id_fk"
		}),
	foreignKey({
			columns: [table.advisorId],
			foreignColumns: [users.id],
			name: "consultation_sessions_advisor_id_users_id_fk"
		}),
]);

export const employeeStats = pgTable("employee_stats", {
	id: serial().primaryKey().notNull(),
	employeeId: integer("employee_id").notNull(),
	month: integer().notNull(),
	year: integer().notNull(),
	totalConsultations: integer("total_consultations").default(0),
	completedConsultations: integer("completed_consultations").default(0),
	pendingConsultations: integer("pending_consultations").default(0),
	cancelledConsultations: integer("cancelled_consultations").default(0),
	totalRevenue: numeric("total_revenue", { precision: 12, scale:  2 }).default('0'),
	averageSatisfactionRating: numeric("average_satisfaction_rating", { precision: 3, scale:  2 }),
	totalHoursWorked: numeric("total_hours_worked", { precision: 8, scale:  2 }).default('0'),
	followUpsCompleted: integer("follow_ups_completed").default(0),
	newClientAcquisitions: integer("new_client_acquisitions").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.employeeId],
			foreignColumns: [users.id],
			name: "employee_stats_employee_id_users_id_fk"
		}),
]);

export const systemLogs = pgTable("system_logs", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	action: varchar({ length: 255 }).notNull(),
	tableName: varchar("table_name", { length: 100 }),
	recordId: integer("record_id"),
	oldValues: json("old_values"),
	newValues: json("new_values"),
	ipAddress: varchar("ip_address", { length: 45 }),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "system_logs_user_id_users_id_fk"
		}),
]);

export const userSettings = pgTable("user_settings", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	emailNotifications: boolean("email_notifications").default(true),
	pushNotifications: boolean("push_notifications").default(true),
	desktopNotifications: boolean("desktop_notifications").default(false),
	invoiceReminders: boolean("invoice_reminders").default(true),
	consultationAlerts: boolean("consultation_alerts").default(true),
	marketingEmails: boolean("marketing_emails").default(false),
	twoFactorEnabled: boolean("two_factor_enabled").default(false),
	loginAlerts: boolean("login_alerts").default(true),
	sessionTimeout: integer("session_timeout").default(60),
	theme: varchar({ length: 20 }).default('dark'),
	language: varchar({ length: 10 }).default('en'),
	timezone: varchar({ length: 50 }).default('Asia/Kolkata'),
	currency: varchar({ length: 10 }).default('INR'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("user_settings_user_id_unique").on(table.userId),
]);
