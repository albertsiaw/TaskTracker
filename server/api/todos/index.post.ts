import { db } from '../../database'
import { todos } from '../../database/schema'
import { requireAuth } from '../../utils/auth.helper'
import { scheduleTodoReminders } from '../../utils/reminders'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  if (!body.text) {
    throw createError({ statusCode: 400, statusMessage: 'Text is required' })
  }

  const [newTodo] = await db
    .insert(todos)
    .values({
      userId: user.id,
      text: body.text,
      isPublic: body.isPublic || false,
      deadline: body.deadline ? new Date(body.deadline) : null
    })
    .returning()

  // ✅ Schedule reminders if deadline exists
  if (newTodo.deadline) {
    await scheduleTodoReminders(newTodo, user.email)
  }

  return newTodo
})
