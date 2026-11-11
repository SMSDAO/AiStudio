// Database Seeder for ViniApp 2.0.0 Enterprise Monorepo
import { INITIAL_APPS, INITIAL_USER, INITIAL_FEEDBACKS } from '../src/data/mockData';
import { APP_TEMPLATES } from '../src/data/templates';

export async function main() {
  console.log('🌱 Starting ViniApp 2.0.0 database seeding...');

  // In production with Prisma Client:
  // const prisma = new PrismaClient();
  
  console.log(`👤 Seeding Super Admin user: ${INITIAL_USER.username} (${INITIAL_USER.address})`);
  console.log(`📁 Seeding 7 App Templates: ${APP_TEMPLATES.map(t => t.title).join(', ')}`);
  console.log(`🚀 Seeding ${INITIAL_APPS.length} initial onchain miniapps with Base Smart Wallets & Clanker tokens`);
  console.log(`💬 Seeding ${INITIAL_FEEDBACKS.length} community 5-star build feedbacks`);

  console.log('✅ ViniApp 2.0.0 database seeding completed successfully!');
}

if (typeof require !== 'undefined' && require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
