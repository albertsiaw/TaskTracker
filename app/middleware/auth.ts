export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, checkAuth } = useAuth()
  const publicPages = ['/login', '/register']
  const isPublicPage = publicPages.includes(to.path)

  if (!isPublicPage) {
    await checkAuth()
    if (!user.value) {
      return navigateTo('/login')
    }
  }
})
