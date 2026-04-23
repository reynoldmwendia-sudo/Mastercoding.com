import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const enrollmentsTable = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").notNull(),
  tier: text("tier").notNull(),
  language: text("language").notNull(),
  status: text("status").notNull().default("pending"),
  syllabus: text("syllabus"),
  plan: text("plan"),
  referredBy: text("referred_by"),
  discount: integer("discount").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
});

export const insertEnrollmentSchema = createInsertSchema(enrollmentsTable).omit({
  id: true,
  createdAt: true,
  confirmedAt: true,
  syllabus: true,
  plan: true,
  status: true,
  code: true,
});

export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollmentsTable.$inferSelect;
