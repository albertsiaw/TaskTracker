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
}]

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(6, 'Must be at least 6 characters')
})

type Schema = z.output<typeof schema>

const { login } = useAuth()

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    const success = await login(payload.data.email, payload.data.password)

    if (success) {
      toast.add({
        title: 'Success',
        description: `Welcome back!`,
        color: 'success'
      })
      
      router.push('/private-todo')
    } else {
      toast.add({
        title: 'Login Failed',
        description: 'Invalid email or password',
        color: 'error'
      })
    }
  } catch (error: any) {
    console.error('Login error:', error)
    toast.add({
      title: 'Error',
      description: 'An unexpected error occurred',
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
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        :loading="loading"
        @submit="onSubmit"
      />
      <div class="mt-4 text-center">
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?
          <NuxtLink to="/register" class="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
            Register here
          </NuxtLink>
        </p>
      </div>
    </UPageCard>
  </div>
</template>


