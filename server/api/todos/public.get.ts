import { db } from '../../database'
import { todos, user } from '../../database/schema'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // Get all public todos with user info
  const publicTodos = await db
    .select({
      id: todos.id,
      userId: todos.userId,
      text: todos.text,
      completed: todos.completed,
      isPublic: todos.isPublic,
      createdAt: todos.createdAt,
      userEmail: user.email,
      userName: user.name
    })
    .from(todos)
    .leftJoin(user, eq(todos.userId, user.id))
    .where(eq(todos.isPublic, true))
    .orderBy(desc(todos.createdAt))

  return publicTodos
})
