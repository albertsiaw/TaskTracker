export const getUserFromCookie = (event: any) => {
  const authCookie = getCookie(event, 'auth_user')
  if (!authCookie) {
    return null
  }
  try {
    return JSON.parse(authCookie)
  } catch {
    return null
  }
}

export const requireAuth = (event: any) => {
  const user = getUserFromCookie(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return user
}
