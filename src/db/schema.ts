import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  boolean,
  pgEnum,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";

//npx drizzle-kit push:pg

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  stripeCustomerId: text("stripe_customer_id"),
  subscribed: boolean("subscribed"),
});

export const usersRelations = relations(users, ({ many }) => ({
  quizes: many(quizes),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const quizes = pgTable("quizes", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  userId: text("user_id").references(() => users.id),
});

export const quizesRelations = relations(quizes, ({ many, one }) => ({
  questions: many(questions),
  submissions: many(quizSubmissions),
}));

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  questionText: text("question_text"),
  quizId: integer("quiz_id"),
});

export const questionsRelations = relations(questions, ({ one, many }) => ({
  quiz: one(quizes, {
    fields: [questions.quizId],
    references: [quizes.id],
  }),
  answers: many(questionAnswers),
}));

export const questionAnswers = pgTable("answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id"),
  answerText: text("answer_text"),
  isCorrect: boolean("is_correct"),
});

export const questionAnswersRelations = relations(
  questionAnswers,
  ({ one }) => ({
    question: one(questions, {
      fields: [questionAnswers.questionId],
      references: [questions.id],
    }),
  })
);

export const quizSubmissions = pgTable("quiz_submissions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id"),
  score: integer("score"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizSubmissionsRelations = relations(
  quizSubmissions,
  ({ one, many }) => ({
    quiz: one(quizes, {
      fields: [quizSubmissions.quizId],
      references: [quizes.id],
    }),
  })
);

export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  logoUrl: text("logoUrl").notNull(),
  slideImage1Url: text("slideImage1Url").notNull(),
  slideImage2Url: text("slideImage2Url").notNull(),
  slideImage3Url: text("slideImage3Url").notNull(),
  approved: boolean("approved").default(false),
  score: integer("score").default(0).notNull(), // ✅ Required for leaderboard logic
});