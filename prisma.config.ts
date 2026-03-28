import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // En la v6, si usas Prisma Postgres (Serverless), 
    // a veces necesitas pasar la URL aquí explícitamente si no lee el config
    datasources: {
      db: {
        url: process.env.DATABASE_URL_DATABASE_URL || process.env.DATABASE_URL, 
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma