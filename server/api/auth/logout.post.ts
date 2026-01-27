export default defineEventHandler((event) => {
  deleteCookie(event, 'auth_user', { path: '/' })
  return { success: true }
})
