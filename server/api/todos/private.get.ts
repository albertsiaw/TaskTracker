import { db } from '../../database'
import { todos, user as userTable } from '../../database/schema'
import { eq, desc, and } from 'drizzle-orm'

import { requireAuth } from '../../utils/auth.helper'

export default defineEventHandler(async (event) => {
  // Get private todos for current user
  const user = await requireAuth(event)
  const userTodos = await db
    .select({
      id: todos.id,
      userId: todos.userId,
      text: todos.text,
      completed: todos.completed,
      isPublic: todos.isPublic,
      deadline: todos.deadline,
      createdAt: todos.createdAt,
      userEmail: userTable.email,
      userName: userTable.name
    })
    .from(todos)
    .leftJoin(userTable, eq(todos.userId, userTable.id))
    .where(and(eq(todos.userId, user.id), eq(todos.isPublic, false)))
    .orderBy(desc(todos.createdAt))

  return userTodos
})
