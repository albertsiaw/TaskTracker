import { db } from '../../database'
import { todos } from '../../database/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth.helper'
import { scheduleTodoReminders, removeTodoReminders } from '../../utils/reminders'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const todoId = getRouterParam(event, 'id')
  const body = await readBody(event)

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

  const newDeadline = body.deadline !== undefined ? (body.deadline ? new Date(body.deadline) : null) : todo.deadline
  const isCompletedChange = body.completed !== undefined && body.completed !== todo.completed

  const [updated] = await db
    .update(todos)
    .set({
      completed: body.completed ?? todo.completed,
      text: body.text ?? todo.text,
      isPublic: body.isPublic ?? todo.isPublic,
      deadline: newDeadline
    })
    .where(eq(todos.id, todoId))
    .returning()

  //  Reschedule reminders if deadline changed or handle completion
  if (updated.completed) {
    await removeTodoReminders(updated.id)
  } else if (JSON.stringify(newDeadline) !== JSON.stringify(todo.deadline)) {
    await removeTodoReminders(updated.id)
    if (updated.deadline) {
      await scheduleTodoReminders(updated, user.email)
    }
  }

  return updated
})
