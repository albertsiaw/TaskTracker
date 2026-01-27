import { db } from '../../database'
import { todos } from '../../database/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.helper'
import { removeTodoReminders } from '../../utils/reminders'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const todoId = getRouterParam(event, 'id')

  if (!todoId) {
    throw createError({ statusCode: 400, statusMessage: 'Todo ID is required' })
  }

  // Verify user owns the todo
  const [todo] = await db
    .select()
    .from(todos)
    .where(and(eq(todos.id, todoId), eq(todos.userId, user.id)))

  if (!todo) {
    throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
  }

  await removeTodoReminders(todoId)
  await db.delete(todos).where(eq(todos.id, todoId))

  return { success: true }
})
