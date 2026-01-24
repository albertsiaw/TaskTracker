// Mock user database
const mockUsers = [
  {
    id: '1',
    email: 'albert@gmail.com',
    password: 'albert123',
    name: 'Albert'
  }
]

export function validateCredentials(email: string, password: string) {
  const user = mockUsers.find(u => u.email === email)
  
  if (!user) {
    return null
  }
  
  if (user.password !== password) {
    return null
  }
  
  // Return user without password
  return {
    id: user.id,
    email: user.email,
    name: user.name
  }
}

export function getUserById(id: string) {
  const user = mockUsers.find(u => u.id === id)
  if (!user) return null
  
  // Return user without password
  return {
    id: user.id,
    email: user.email,
    name: user.name
  }
}
