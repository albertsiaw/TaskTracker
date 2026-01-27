async function test() {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
    });
    
    if (!loginRes.ok) {
        console.log('Login failed, trying register...');
        const regRes = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
        });
        console.log('Register status:', regRes.status);
    }

    const cookie = loginRes.headers.get('set-cookie');
    console.log('Cookie received:', cookie);

    // 2. Create Todo
    console.log('Creating todo...');
    const createRes = await fetch('http://localhost:3000/api/todos', {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'Cookie': cookie || ''
      },
      body: JSON.stringify({ text: 'API Test Todo', isPublic: true })
    });
    
    const newTodo = await createRes.json();
    console.log('Create Response:', newTodo);

    // 3. Get Public Todos
    console.log('Fetching public todos...');
    const getRes = await fetch('http://localhost:3000/api/todos/public');
    const publicTodos = await getRes.json();
    console.log('Public Todos count:', publicTodos.length);
    if (publicTodos.length > 0) {
        console.log('First todo keys:', Object.keys(publicTodos[0]));
    }

  } catch (err) {
    console.error('Test failed:', err.message);
  }
}

test();
