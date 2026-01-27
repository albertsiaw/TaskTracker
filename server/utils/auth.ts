export function requireUser(event: any) {
  const cookie = getCookie(event, 'user')

  if (!cookie) {
    throw createError({ statusCode: 401 })
  }

  return JSON.parse(cookie)
}
