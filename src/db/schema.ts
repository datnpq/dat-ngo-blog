import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  serial,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    body: text("body").notNull(),
    excerpt: varchar("excerpt", { length: 300 }),
    tags: text("tags").array(),
    featuredImageUrl: varchar("featured_image_url", { length: 2048 }),
    seoTitle: varchar("seo_title", { length: 60 }),
    seoDescription: varchar("seo_description", { length: 160 }),
    language: varchar("language", { length: 2 }).notNull().default("vi"),
    tier: varchar("tier", { length: 10 }).notNull().default("free"),
    views: integer("views").notNull().default(0),
    status: varchar("status", { length: 10 }).notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
  },
  (table) => [
    index("idx_posts_status_published_at").on(table.status, table.publishedAt),
    uniqueIndex("idx_posts_slug").on(table.slug),
  ]
);

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true }).notNull().default(sql`now()`),
});

export const rateLimitAttempts = pgTable(
  "rate_limit_attempts",
  {
    id: serial("id").primaryKey(),
    ipAddress: varchar("ip_address", { length: 45 }).notNull(),
    attemptedAt: timestamp("attempted_at", { withTimezone: true }).notNull().default(sql`now()`),
    windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("idx_rate_limit_ip_window").on(table.ipAddress, table.windowStart),
  ]
);

export const author = pgTable("author", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
});

export const subscribers = pgTable(
  "subscribers",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    email: varchar("email", { length: 320 }).notNull().unique(),
    status: varchar("status", { length: 12 }).notNull().default("active"), // active | unsubscribed
    source: varchar("source", { length: 40 }),
    unsubscribeToken: uuid("unsubscribe_token").notNull().default(sql`gen_random_uuid()`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
  },
  (table) => [uniqueIndex("idx_subscribers_email").on(table.email)]
);

export type PostRecord = typeof posts.$inferSelect;
export type NewPostRecord = typeof posts.$inferInsert;
export type SessionRecord = typeof sessions.$inferSelect;
export type NewSessionRecord = typeof sessions.$inferInsert;
export type RateLimitRecord = typeof rateLimitAttempts.$inferSelect;
export type AuthorRecord = typeof author.$inferSelect;
export type SubscriberRecord = typeof subscribers.$inferSelect;
export type NewSubscriberRecord = typeof subscribers.$inferInsert;
