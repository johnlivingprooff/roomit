import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

export const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

export async function createUser(phone: string, name: string, role: 'renter' | 'host' | 'admin') {
  if (!sql) throw new Error('Database not configured');
  
  const existing = await sql`SELECT * FROM users WHERE phone = ${phone}`;
  
  if (existing.length > 0) {
    const [user] = await sql`
      UPDATE users 
      SET name = ${name}, role = ${role}, updated_at = NOW()
      WHERE phone = ${phone}
      RETURNING *
    `;
    return user;
  }
  
  const [user] = await sql`
    INSERT INTO users (phone, name, role, verified_status, risk_score)
    VALUES (${phone}, ${name}, ${role}, 'none', 0)
    RETURNING *
  `;
  return user;
}

export async function getUserByPhone(phone: string) {
  if (!sql) throw new Error('Database not configured');
  const [user] = await sql`SELECT * FROM users WHERE phone = ${phone}`;
  return user;
}

export async function getUserById(id: string) {
  if (!sql) throw new Error('Database not configured');
  const [user] = await sql`SELECT * FROM users WHERE id = ${id}`;
  return user;
}
