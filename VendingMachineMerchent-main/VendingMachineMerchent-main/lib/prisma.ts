import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + (process.env.NODE_ENV === 'development' ? '?prepared_statements=false' : '')
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma