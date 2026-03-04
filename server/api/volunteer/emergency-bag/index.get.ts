import { z } from "zod"
import { prisma } from "#server/utils/db"

export default defineEventHandler(async (event) => {
    return "Hello World"
})
