import { relations } from "drizzle-orm/relations";
import { consultations, invoices, consultationNotes, users, consultationSessions, employeeStats, systemLogs } from "./schema";

export const invoicesRelations = relations(invoices, ({one}) => ({
	consultation: one(consultations, {
		fields: [invoices.consultationId],
		references: [consultations.id]
	}),
}));

export const consultationsRelations = relations(consultations, ({many}) => ({
	invoices: many(invoices),
	consultationNotes: many(consultationNotes),
	consultationSessions: many(consultationSessions),
}));

export const consultationNotesRelations = relations(consultationNotes, ({one}) => ({
	consultation: one(consultations, {
		fields: [consultationNotes.consultationId],
		references: [consultations.id]
	}),
	user: one(users, {
		fields: [consultationNotes.authorId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	consultationNotes: many(consultationNotes),
	consultationSessions: many(consultationSessions),
	employeeStats: many(employeeStats),
	systemLogs: many(systemLogs),
}));

export const consultationSessionsRelations = relations(consultationSessions, ({one}) => ({
	consultation: one(consultations, {
		fields: [consultationSessions.consultationId],
		references: [consultations.id]
	}),
	user: one(users, {
		fields: [consultationSessions.advisorId],
		references: [users.id]
	}),
}));

export const employeeStatsRelations = relations(employeeStats, ({one}) => ({
	user: one(users, {
		fields: [employeeStats.employeeId],
		references: [users.id]
	}),
}));

export const systemLogsRelations = relations(systemLogs, ({one}) => ({
	user: one(users, {
		fields: [systemLogs.userId],
		references: [users.id]
	}),
}));