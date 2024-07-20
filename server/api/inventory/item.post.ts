import { z } from "zod"

const schema = z.object({
	itemID: z.string(),
	name: z.string(),
	categoryName: z.string(),
	imgURL: z.string(),
	quantity: z.number().int().nonnegative(),
})

const validateSchema = schema.strict().partial().required({
	itemID: true,
})

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { itemID, name, categoryName, imgURL, quantity } = result.data
	// check if category exists if need to change category
	if (categoryName) {
		const category = await event.context.prisma.category.findUnique({
			where: {
				name: categoryName,
			},
		})
		if (!category) {
			throw createError({ statusCode: 400, statusMessage: "Category does not exist" })
		}
	}
	// if field is undefined, prisma will not update it
	// almost like GraphQL
	const item = await event.context.prisma.item.update({
		where: {
			itemID: itemID,
		},
		data: {
			name: name,
			imgURL: imgURL,
			categoryName: categoryName,
			quantity: quantity,
		},
	})
	if(!item) {
		throw createError({ statusCode: 500, statusMessage: "Failed to edit item" })
	}
	return "Successfully edited item"
})
