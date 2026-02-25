import { z } from "zod"
import { prisma } from "#server/utils/prismaUtil"

export default defineEventHandler(async (event) => {
	return "Hello World"
})
