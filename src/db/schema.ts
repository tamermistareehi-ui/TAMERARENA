import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

// Portfolio projects grouped by category (mirrors Drive folder structure)
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  imageUrl: text("image_url").notNull(),
  fileType: varchar("file_type", { length: 30 }).notNull().default("image"),
  fileName: varchar("file_name", { length: 255 }),
  link: text("link"),
  tags: text("tags").notNull().default(""),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Courses & certificates
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  issuer: varchar("issuer", { length: 200 }).notNull(),
  year: varchar("year", { length: 20 }).notNull(),
  imageUrl: text("image_url"),
  link: text("link"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Contact form messages (persisted + emailed)
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  note: text("note").notNull(),
  emailed: boolean("emailed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Uploaded media (stored as base64 in DB so it survives rebuilds)
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  data: text("data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Key/value site settings (profile photo, bio, etc.)
export const settings = pgTable("settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value").notNull(),
});
