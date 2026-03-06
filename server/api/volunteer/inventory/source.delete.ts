import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		source: z.string(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { source } = await validateBody(event, schema)

	try {
		await prisma.source.update({
			where: {
				name: source,
			},
			data: {
				archived: true,
			},
		})
		return "Successfully archived source"
	} catch (error) {
		if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "No source found with name" })
		}
		throw error
	}
})
