import { signIn, signUp, signOut, useSession } from "../utils/auth-client"
import { computed } from 'vue'

export const useAuth = () => {
    const sessionResponse = useSession()
    
    const session = computed(() => sessionResponse.value?.data)
    const loading = computed(() => sessionResponse.value?.isPending)
    
    // Fallback to maintain compatibility with existing code
    const user = computed(() => session.value?.user || null)
    const isAuthenticated = computed(() => !!session.value)

    const login = async (email: string, password: string) => {
        try {
            const { error } = await signIn.email({
                email,
                password
            })
            if (error) {
                console.error("Login failed:", error.message)
                return false
            }
            return true
        } catch (error: any) {
            console.error("Login unexpected error:", error.message)
            return false
        }
    }

    const register = async (email: string, password: string, name: string = "") => {
        const userName = name || (email && email.includes('@') ? email.split('@')[0] : "User")
        try {
            const { error } = await signUp.email({
                email,
                password,
                name: userName as string
            })
            if (error) {
                console.error("Registration failed:", error.message)
                return false
            }
            return true
        } catch (error: any) {
            console.error("Registration unexpected error:", error.message)
            return false
        }
    }

    const logout = async () => {
        try {
            await signOut()
            navigateTo('/')
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    const checkAuth = async () => {
        return !!session.value
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
