<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const router = useRouter()
const toast = useToast()
const loading = ref(false)

definePageMeta({
  middleware: [],
  layout: false
})

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'Enter your email',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password',
  required: true
}, {
  name: 'passwordConfirm',
  label: 'Confirm Password',
  type: 'password',
  placeholder: 'Confirm your password',
  required: true
}]

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(6, 'Must be at least 6 characters'),
  passwordConfirm: z.string('Password confirmation is required')
}).refine(data => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"]
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    const response: any = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        email: payload.data.email,
        password: payload.data.password
      }
    })

    if (response.success) {
      toast.add({
        title: 'Success',
        description: `Account created! Welcome ${response.user.email}!`,
        color: 'success'
      })
      
      setTimeout(() => {
        router.push('/private-todo')
      }, 500)
    }
  } catch (error: any) {
    console.error('Register error:', error)
    const message = error.data?.statusMessage || error.message || 'Registration failed'
    toast.add({
      title: 'Registration Failed',
      description: message,
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4 min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Create Account"
        description="Register for a new account."
        icon="i-lucide-user-plus"
        :fields="fields"
        :loading="loading"
        @submit="onSubmit"
      />
      <div class="mt-4 text-center">
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Already have an account?
          <NuxtLink to="/login" class="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
            Login here
          </NuxtLink>
        </p>
      </div>
    </UPageCard>
  </div>
</template>
