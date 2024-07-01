import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default defineEventHandler((event) => {
	event.context.prisma = prisma
})
