//Routing is done with CSR - React Router
//This server, the backend of Comet Cupboard, is primarily used to fetch and store data on the database.
//Later, it will also be used to handle cookies and authentication
import { PrismaClient } from '@prisma/client'
import express, {Express, Request, Response} from "express"
import {status} from '@prisma/client'


const prisma = new PrismaClient()
const port: number = 8000;
const app: Express = express();

async function main() {
  // const students = await prisma.student.findMany();
  // console.log(students) //Prints all the students in student table
  // ... you will write your Prisma Client queries here
  //npx ts-node src/server.ts unless in this directory
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

  app.listen(port, () => { 
    console.log(`Server started and listening on port ${port}`)
  });