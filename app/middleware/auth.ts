export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/home') {
    try {
      const response: any = await $fetch('/api/auth', { method: 'GET' })
      
      if (!response.user) {
        return navigateTo('/login')
      }
    } catch (error) {
      return navigateTo('/login')
    }
  }
})
