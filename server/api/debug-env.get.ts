export default defineEventHandler((event) => {
  return {
    DATABASE_URL: process.env.DATABASE_URL,
  }
})
