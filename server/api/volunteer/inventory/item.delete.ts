import { z } from "zod"
import { unlink } from "node:fs/promises"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

const schema = z.object({
	itemID: z.string(),
})

const validateSchema = schema.strict().required()

export default defineSafeHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid request body" })
	}
	const { itemID } = result.data

	// delete item (really just archive it)
	const item = await prisma.item.update({
		where: {
			itemID: itemID,
		},
		data: {
			archived: true,
			quantity: 0, // Reset inventory upon deleting
		},
	})

	if (!item) {
		throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: `Failed to delete item with id ${itemID}` })
	}

	// delete old image, if this fails we're not in that much trouble hopefully
	// kind of lazy to put the item back in the db if this fails
	await unlink(`${process.env.IMAGE_UPLOAD_DIRECTORY}/${item.imgName}`)

	return `Successfully deleted item with id ${itemID}`
})
