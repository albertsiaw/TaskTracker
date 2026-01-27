<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const { user, logout: authLogout } = useAuth()

const logout = async () => {
  await authLogout()
}

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Private TODO',
    to: '/private-todo',
    active: route.path === '/private-todo',
    icon: 'i-heroicons-lock-closed'
  },
  {
    label: 'Public TODO',
    to: '/public-todo',
    active: route.path === '/public-todo',
    icon: 'i-heroicons-globe-alt'
  }
])

const avatarUrl = computed(() => {
  if (!user.value?.email) return null
  return `https://www.gravatar.com/avatar/${user.value.email}?d=mp`
})

const userName = computed(() => {
  if (!user.value?.name && !user.value?.email) return 'User'
  return user.value.name || user.value.email?.split('@')[0]
})

const userEmail = computed(() => {
  return user.value?.email || 'No email'
})

// Dropdown items with user info
const dropdownItems = computed(() => [[
  { 
    label: userName.value, 
    icon: 'i-heroicons-user-circle',
    disabled: true,
    class: 'font-semibold'
  },
  { 
    label: userEmail.value, 
    icon: 'i-heroicons-envelope',
    disabled: true,
    class: 'text-xs text-slate-500'
  }
], [
  { 
    label: 'Logout', 
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: logout,
    class: 'text-red-600 dark:text-red-400'
  }
]])
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <UHeader>
      <template #title>
        <NuxtLink to="/private-todo" class="flex items-center font-bold text-lg">
          <NuxtImg 
            src="https://i.pinimg.com/1200x/90/2d/d1/902dd13c0ed3470d2367a47c2c01012f.jpg"
            class="inline-block w-12 h-12 mr-2 rounded-full" 
          />
          <span class="hidden sm:inline">TODO App</span>
        </NuxtLink>
      </template>

      <!-- Navigation Menu (responsive) -->
      <UNavigationMenu :items="items" class="hidden md:flex" />

      <template #right>
        <!-- Mobile Navigation Menu -->
        <UDropdown :items="[items]" class="md:hidden">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-bars-3"
            aria-label="Menu"
          />
        </UDropdown>

        <UColorModeButton />

        <!-- User Profile Dropdown -->
        <UDropdown
          v-if="user"
          :items="dropdownItems"
        >
          <UAvatar
            :src="avatarUrl || undefined"
            :alt="userName"
            size="sm"
            class="cursor-pointer ring-2 ring-slate-200 dark:ring-slate-700 hover:ring-blue-400 transition-all"
          />
        </UDropdown>
      </template>
    </UHeader>

    <main class="flex-1 bg-slate-50 dark:bg-slate-900">
      <slot />
    </main>
  </div>
</template>
