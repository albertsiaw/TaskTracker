export default defineNuxtRouteMiddleware(async (to) => {
  const { user, checkAuth } = useAuth()
  
  if (to.path === '/home' || to.path === '/private-todo') {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated || !user.value) {
      return navigateTo('/login')
    }
  }
})
