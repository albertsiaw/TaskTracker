import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp
} from 'drizzle-orm/pg-core'

export const todos = pgTable('todos', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  text: text('text').notNull(),
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').defaultNow()
})
