import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating admin user...')

  const passwordHash = await bcrypt.hash('CoderMaster#2026', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@kitesurf360.com' },
    update: {},
    create: {
      email: 'admin@kitesurf360.com',
      name: 'Admin KITE360',
      passwordHash,
      isVerified: true,
      verificationLevel: 'PRO',
      subscriptionPlan: 'BUSINESS',
      bio: 'Administrador do KITE360',
    },
  })

  console.log(`Admin user created: ${admin.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })