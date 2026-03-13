import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { Prisma } from "../../../../prisma/generated/prisma/client"

const schema = z
	.object({
		fieldID: z.string(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { fieldID } = await validateBody(event, schema)

	try {
		await prisma.field.delete({
			where: {
				fieldID: fieldID,
			},
		})
		return "Field deleted successfully"
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "No field found with id" })
		}
		throw error
	}
})
