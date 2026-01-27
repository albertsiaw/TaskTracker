import { db } from '../../database'
import { users } from '../../database/schema'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, statusMessage: 'Missing fields' })
  }

  try {
    const hash = await bcrypt.hash(body.password, 10)

    const [user] = await db
      .insert(users)
      .values({
        email: body.email,
        password: hash,
      })
      .returning({ id: users.id, email: users.email })

    // ✅ Send welcome email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Welcome to Todo App 🎉',
        html: `
          <h2>Welcome!</h2>
          <p>Your account was created successfully.</p>
          <p>Start organizing your tasks 🚀</p>
        `,
      })
    } catch (mailError) {
      console.error('Failed to send welcome email:', mailError)
      // We don't want to fail the whole registration if email fails
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
    console.error('Registration error:', error)
    if (error.code === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'Email already exists' })
    }
    throw createError({ statusCode: 500, statusMessage: error.message || 'Registration failed' })
  }
})
