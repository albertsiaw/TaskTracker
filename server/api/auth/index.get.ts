import { db } from '../../database'
import { users } from '../../database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const authCookie = getCookie(event, 'auth_user')

  if (!authCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }

  try {
    const user = JSON.parse(authCookie)
    return { user }
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid auth' })
  }
})
