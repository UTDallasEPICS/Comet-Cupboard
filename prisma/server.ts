import { PrismaClient } from '@prisma/client'
import express, {Express, Request, Response} from "express"
import {status} from '@prisma/client'


const prisma = new PrismaClient()
const app: Express = express();


async function main() {
    const students = await prisma.student.findMany();
    console.log(students)
  // ... you will write your Prisma Client queries here
  //npx ts-node prisma/server.ts unless in this directory
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