import { z } from 'zod'

export const todoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  deadline: z.string().datetime().nullable().optional(),
  isPublic: z.boolean().default(false)
})

// Optionally export the type to use in your Vue components
export type TodoInput = z.infer<typeof todoSchema>

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export type LoginInput = z.infer<typeof loginSchema>