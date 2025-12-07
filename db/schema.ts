import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// 1. The Offerings (Repeatable Items)
export const offerings = sqliteTable('offerings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  href: text('href'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
});

// 2. The Pages (Singleton/Flexible Content)
export const pages = sqliteTable('pages', {
  slug: text('slug').primaryKey(),
  content: text('content', { mode: 'json' }).notNull(), 
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
});