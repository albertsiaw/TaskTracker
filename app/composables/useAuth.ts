export const useAuth = () => {
  const user = useState<{ id: string; email: string } | null>('auth-user', () => null)
  const isAuthenticated = useState<boolean>('auth-authenticated', () => false)
  const loading = useState<boolean>('auth-loading', () => false)

  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const response: any = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (response.success) {
        user.value = response.user
        isAuthenticated.value = true
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, password: string) => {
    loading.value = true
    try {
      const response: any = await $fetch('/api/auth/register', {
        method: 'POST',
        body: { email, password }
      })

      if (response.success) {
        user.value = response.user
        isAuthenticated.value = true
        return true
      }
      return false
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      user.value = null
      isAuthenticated.value = false
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const checkAuth = async () => {
    try {
      const response: any = await $fetch('/api/auth')
      if (response?.user) {
        user.value = response.user
        isAuthenticated.value = true
      } else {
        user.value = null
        isAuthenticated.value = false
      }
    } catch {
      user.value = null
      isAuthenticated.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkAuth
  }
}
