import { prisma } from "../db"

export default defineEventHandler(async (event) => {
	return await prisma.item.findMany()
})
