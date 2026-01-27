import { db } from '../../database'
import { todos } from '../../database/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.helper'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const todoId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!todoId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Todo ID is required'
    })
  }

  // Verify user owns the todo
  const [todo] = await db
    .select()
    .from(todos)
    .where(and(eq(todos.id, todoId), eq(todos.userId, user.id)))

  if (!todo) {
    throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
  }

  const [updated] = await db
    .update(todos)
    .set({
      completed: body.completed ?? todo.completed,
      text: body.text ?? todo.text,
      isPublic: body.isPublic ?? todo.isPublic
    })
    .where(eq(todos.id, todoId))
    .returning()

  return updated
})
