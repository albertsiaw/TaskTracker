import { defineEventHandler, getMethod, readBody, createError } from 'h3'
import { validateCredentials } from '../../utils/auth'
import { loginSchema } from '../../../lib/schemas'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  if (method === 'POST') {
    // Login
    const body = await readBody(event)
    
    // Validate input
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid credentials'
      })
    }

    const { email, password } = validation.data
    const user = validateCredentials(email, password)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }

    // Set session using nuxt-auth-utils
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })

    return {
      success: true,
      user
    }
  }

  if (method === 'GET') {
    // Get current user
    const session = await getUserSession(event)
    
    if (!session?.user) {
      return {
        user: null
      }
    }

    return {
      user: session.user
    }
  }

  if (method === 'DELETE') {
    // Logout
    await clearUserSession(event)
    return {
      success: true
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
