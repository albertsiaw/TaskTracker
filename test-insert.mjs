import pg from 'pg';
import 'dotenv/config';

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

async function test() {
  try {
    await client.connect();
    // Get a user id
    const res = await client.query('SELECT id FROM users LIMIT 1');
    if (res.rows.length === 0) {
      console.log('No users found');
      await client.end();
      return;
    }
    const userId = res.rows[0].id;
    console.log('Inserting todo for user:', userId);
    
    const insertRes = await client.query(
      'INSERT INTO todos (user_id, text, is_public) VALUES ($1, $2, $3) RETURNING *',
      [userId, 'Test todo from script', true]
    );
    console.log('Inserted:', insertRes.rows[0]);
    
    await client.end();
  } catch (err) {
    console.error('Operation failed:', err.message);
    process.exit(1);
  }
}

test();
