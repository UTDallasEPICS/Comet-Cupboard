import { nanoid } from "nanoid"
import { z } from "zod"

const schema = z.object({
	name: z.string(),
	categoryName: z.string(),
	imgURL: z.string(),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { name, categoryName, imgURL } = result.data
	// check if category exists
	const category = await event.context.prisma.category.findUnique({
		where: {
			name: categoryName,
		},
	})
	if (!category) {
		throw createError({ statusCode: 400, statusMessage: "Category does not exist" })
	}
	const item = await event.context.prisma.item.create({
		data: {
			itemID: nanoid(),
			name: name,
			imgURL: imgURL,
			categoryName: categoryName,
		},
	})
	if(!item) {
		throw createError({ statusCode: 500, statusMessage: "Failed to create item" })
	}
	return "Successfully created item"
})
