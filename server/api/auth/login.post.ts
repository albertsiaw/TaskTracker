import { db } from '../../database'
import { users } from '../../database/schema'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email))

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
    }

    const valid = await bcrypt.compare(body.password, user.password)

    if (!valid) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
    }

    setCookie(event, 'auth_user', JSON.stringify({ id: user.id, email: user.email }), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    })

    return { 
      success: true,
      user: { id: user.id, email: user.email }
    }
  } catch (error: any) {
    console.error('Login error:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({ statusCode: 500, statusMessage: error.message || 'Login failed' })
  }
})
