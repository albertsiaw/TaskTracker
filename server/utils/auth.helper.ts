import { auth } from "./auth";

export const getUserSession = async (event: any) => {
  const session = await auth.api.getSession({
    headers: event.headers
  });
  return session;
}

export const requireAuth = async (event: any) => {
  const session = await getUserSession(event);
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return session.user;
}
