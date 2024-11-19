import { PrismaClient } from '@prisma/client'
import { hash, compare } from 'bcrypt'
import { prisma } from './Prisma';




const saltRounds = 10;
const myPlaintextPassword = 'not_bacon';

async function main() {
  const user = await prisma.user.create({
    data: {
      userName: 'Malice',
      password: await hash(myPlaintextPassword, saltRounds)
    },
  })
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })