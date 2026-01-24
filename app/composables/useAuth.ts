export const useAuth = () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  const login = async (email: string, password: string) => {
    try {
      const response: any = await $fetch('/api/auth', {
        method: 'POST',
        body: { email, password }
      })

      if (response.success) {
        user.value = response.user
        isAuthenticated.value = true
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.user))
        }
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth', { method: 'DELETE' })
      user.value = null
      isAuthenticated.value = false
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        user.value = JSON.parse(savedUser)
        isAuthenticated.value = true
      }
    }
  }

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    login,
    logout,
    checkAuth
  }
}
