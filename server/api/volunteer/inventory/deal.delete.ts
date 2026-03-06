import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { Prisma } from "../../../../prisma/generated/prisma/client"

const schema = z
	.object({
		itemID: z.string(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { itemID } = await validateBody(event, schema)

	try {
		await prisma.deal.delete({
			where: {
				itemID: itemID,
			},
		})
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "No deal found for item" })
		}
		throw error
	}

	return "Successfully deleted deal for item"
})
