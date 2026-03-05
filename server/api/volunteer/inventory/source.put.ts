import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

const schema = z.object({
	source: z.string(),
})

const validateSchema = schema.strict().required()

export default defineSafeHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid input" })
	}

	const { source } = result.data

	//Check for an archived source with the same name as the source being added:
	const archivedSource = await prisma.source.findUnique({
		where: {
			name: source,
			archived: true,
		},
	})

	//If there is an archived source that has the same name as the source being added, unarchive that source:
	if (archivedSource) {
		const newSource = await prisma.source.update({
			where: {
				name: source,
				archived: true,
			},
			data: {
				archived: false,
			},
		})
		return newSource
	}
	
	//Else, create a new source:
	try {
		const newSource = await prisma.source.create({
			data: {
				name: source,
			},
		})
		return newSource
	} catch (error) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Error adding Source" })
	}
})
