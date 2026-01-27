import { db } from '../../database'
import { todos } from '../../database/schema'
import { eq, desc, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // Get private todos for current user
  const authCookie = getCookie(event, 'auth_user')
  if (!authCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const user = JSON.parse(authCookie)
  const userTodos = await db
    .select()
    .from(todos)
    .where(and(eq(todos.userId, user.id), eq(todos.isPublic, false)))
    .orderBy(desc(todos.createdAt))

  return userTodos
})
