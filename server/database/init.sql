-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert sample data
INSERT INTO todos (user_id, text, completed)
VALUES
  (gen_random_uuid(), 'Finish Nuxt Todo UI', false),
  (gen_random_uuid(), 'Learn Drizzle ORM', false),
  (gen_random_uuid(), 'Setup Redis + BullMQ', true);
