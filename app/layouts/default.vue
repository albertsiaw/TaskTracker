<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const logout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    navigateTo('/login')
  } catch (error) {
    console.error('Logout failed:', error)
    navigateTo('/login')
  }
}

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Private TODO',
    to: '/private-todo',
    active: route.path === '/private-todo'
  },
  {
    label: 'Public TODO',
    to: '/public-todo',
    active: route.path === '/public-todo'
  }
])
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <UHeader>
      <template #title>
        <div class="font-bold text-lg">
          <NuxtImg 
            src="https://i.pinimg.com/1200x/90/2d/d1/902dd13c0ed3470d2367a47c2c01012f.jpg"
            class="inline-block w-12 h-12 mr-2 rounded-full" 
          />
          TODO App
        </div>
      </template>

      <UNavigationMenu :items="items" />

      <template #right>
        <UColorModeButton />

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-log-out"
          aria-label="Logout"
          @click="logout"
        />
      </template>
    </UHeader>

    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
