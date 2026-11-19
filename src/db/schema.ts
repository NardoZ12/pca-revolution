import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  name: text('name'),
  email: text('email').notNull(),
  role: text('role').default('student'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  courseId: text('course_id').notNull(),
  courseTitle: text('course_title').notNull(),
  plan: text('plan').default('trial-12-days'),
  status: text('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  course: text('course'),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  enrollments: many(enrollments),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
}));

export const studentAccounts = pgTable('student_accounts', {
  uid: text('uid').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  displayName: text('display_name').notNull(),
  role: text('role').default('student').notNull(),
  plan: text('plan').default('free_trial').notNull(),
  paymentStatus: text('payment_status').default('pending').notNull(),
  profileJson: text('profile_json').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const teacherAccounts = pgTable('teacher_accounts', {
  uid: text('uid').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  displayName: text('display_name').notNull(),
  isVerified: text('is_verified').default('true').notNull(),
  profileJson: text('profile_json').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const academyCourses = pgTable('academy_courses', {
  id: text('id').primaryKey(),
  isDeleted: text('is_deleted').default('false').notNull(),
  courseJson: text('course_json').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const academySyncState = pgTable('academy_sync_state', {
  key: text('key').primaryKey(),
  payloadJson: text('payload_json').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const academyPayments = pgTable('academy_payments', {
  transactionId: text('transaction_id').primaryKey(),
  studentUid: text('student_uid').notNull(),
  studentEmail: text('student_email').notNull(),
  amount: text('amount').notNull(),
  currency: text('currency').default('USD').notNull(),
  concept: text('concept').notNull(),
  status: text('status').default('COMPLETED').notNull(),
  gateway: text('gateway').default('paypal_js_sdk').notNull(),
  payloadJson: text('payload_json'),
  createdAt: timestamp('created_at').defaultNow(),
});
