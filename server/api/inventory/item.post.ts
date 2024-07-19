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
	console.log(result.error)
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { itemID, name, categoryName, imgURL, quantity } = result.data
	if (categoryName) {
		const category = await event.context.prisma.category.findUnique({
			where: {
				name: categoryName,
			},
		})
		if (!category) {
			throw createError({ statusCode: 400, statusMessage: "No category" })
		}
	}
	console.log(`${itemID} ${name} ${categoryName} ${imgURL} ${quantity}`)

	// if field is undefined, prisma will not update it
	// this is similar to builder pattern
	await event.context.prisma.item.update({
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
})
