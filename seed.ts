import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './src/lib/neon/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Creating admin user...');

  // Create admin user
  const [adminUser] = await db.insert(schema.users).values({
    phone: '+265888000000',
    email: 'admin@roomie.mw',
    name: 'Admin',
    role: 'admin',
    verifiedStatus: 'verified',
    riskScore: 0,
  }).returning();

  console.log('Admin user created:', adminUser);

  // Create a test host user
  const [hostUser] = await db.insert(schema.users).values({
    phone: '+265999000000',
    name: 'John Host',
    role: 'host',
    verifiedStatus: 'verified',
    riskScore: 0,
  }).returning();

  console.log('Host user created:', hostUser);

  // Create a test renter user
  const [renterUser] = await db.insert(schema.users).values({
    phone: '+265999000001',
    name: 'Jane Renter',
    role: 'renter',
    verifiedStatus: 'verified',
    riskScore: 0,
  }).returning();

  console.log('Renter user created:', renterUser);

  console.log('\n✅ Seed complete!');
  console.log('\nAdmin Credentials:');
  console.log('Phone: +265888000000');
  console.log('Password: admin123');
}

seed().catch(console.error);
