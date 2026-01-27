import { db } from '../../database'
import { todos } from '../../database/schema'
import { requireAuth } from '../../utils/auth.helper'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const body = await readBody(event)

  console.log('Creating todo:', { userId: user.id, body })

  if (!body.text) {
    throw createError({ statusCode: 400, statusMessage: 'Text is required' })
  }

  const [newTodo] = await db
    .insert(todos)
    .values({
      userId: user.id,
      text: body.text,
      isPublic: body.isPublic || false
    })
    .returning()

  return newTodo
})
