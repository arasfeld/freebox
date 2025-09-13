import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const client = new PrismaClient({
    log: ['error', 'warn'],
  });

  // Add connection error handling
  client
    .$connect()
    .then(() => {
      console.log('✅ Prisma Client connected successfully');
    })
    .catch(error => {
      console.error('❌ Prisma Client connection failed:', error);
    });

  return client;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
