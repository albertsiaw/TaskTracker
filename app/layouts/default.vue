<script setup lang="ts">
const route = useRoute()
const { user, logout: authLogout } = useAuth()

const isMobileMenuOpen = ref(false)
const isUserDropdownOpen = ref(false)

// Close menus on route change
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
  isUserDropdownOpen.value = false
})

const logout = async () => {
  await authLogout()
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value
}

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

const navLinks = [
  { label: 'Private TODO', to: '/private-todo', icon: 'i-heroicons-lock-closed' },
  { label: 'Public TODO', to: '/public-todo', icon: 'i-heroicons-globe-alt' }
]
</script>

<template>
  <div class="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
    <!-- Custom Header -->
    <header class="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <NuxtLink to="/private-todo" class="flex items-center font-bold text-lg">
              <NuxtImg 
                src="https://i.pinimg.com/1200x/90/2d/d1/902dd13c0ed3470d2367a47c2c01012f.jpg"
                class="block w-10 h-10 mr-2 rounded-full" 
              />
              <span class="hidden sm:inline text-slate-900 dark:text-white">TODO App</span>
            </NuxtLink>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-2">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              :class="[
                route.path === link.to 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              ]"
            >
              <UIcon :name="link.icon" class="w-4 h-4" />
              {{ link.label }}
            </NuxtLink>
          </div>

          <!-- Right Side Actions -->
          <div class="flex items-center gap-4">
            <UColorModeButton />

            <!-- User Menu (Desktop) -->
            <div v-if="user" class="relative hidden md:block">
              <button 
                @click="toggleUserDropdown"
                class="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white"
              >
                <UAvatar
                  :src="avatarUrl || undefined"
                  :alt="userName"
                  size="sm"
                  class="ring-2 ring-slate-200 dark:ring-slate-700 hover:ring-blue-400 transition-all"
                />
              </button>

              <!-- Dropdown Panel -->
              <div 
                v-if="isUserDropdownOpen"
                class="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-slate-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 divide-y divide-slate-100 dark:divide-slate-800"
              >
                <div class="px-4 py-3">
                  <p class="text-sm text-slate-900 dark:text-white font-semibold">{{ userName }}</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ userEmail }}</p>
                </div>
                <div class="py-1">
                  <button 
                    @click="logout"
                    class="group flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <UIcon name="i-heroicons-arrow-right-on-rectangle" class="mr-3 h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            </div>

            <!-- Mobile Menu Button -->
            <div class="-mr-2 flex md:hidden" v-if="user">
              <button 
                @click="toggleMobileMenu"
                class="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <UIcon name="i-heroicons-bars-3" class="block h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Panel -->
      <div v-if="isMobileMenuOpen && user" class="md:hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium"
            :class="[
              route.path === link.to 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            ]"
            @click="isMobileMenuOpen = false"
          >
            <UIcon :name="link.icon" class="w-5 h-5" />
            {{ link.label }}
          </NuxtLink>
        </div>
        
        <!-- Mobile User Info -->
        <div class="pt-4 pb-4 border-t border-slate-200 dark:border-slate-800">
          <div class="flex items-center px-5">
            <div class="flex-shrink-0">
              <UAvatar :src="avatarUrl || undefined" :alt="userName" size="md" />
            </div>
            <div class="ml-3">
              <div class="text-base font-medium leading-none text-slate-900 dark:text-white">{{ userName }}</div>
              <div class="text-sm font-medium leading-none text-slate-500 dark:text-slate-400 mt-1">{{ userEmail }}</div>
            </div>
          </div>
          <div class="mt-3 px-2 space-y-1">
            <button 
              @click="logout"
              class="flex w-full items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>


