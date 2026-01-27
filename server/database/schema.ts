import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow()
})

export const todos = pgTable('todos', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  text: text('text').notNull(),
  completed: boolean('completed').default(false),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow()
})
