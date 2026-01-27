import { db } from '../../database'
import { todos } from '../../database/schema'
import { eq, or, and } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.helper'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  // Get all public todos and user's private todos
  const allTodos = await db
    .select()
    .from(todos)
    .where(
      or(
        eq(todos.isPublic, true),
        eq(todos.userId, user.id)
      )
    )

  return allTodos
})
