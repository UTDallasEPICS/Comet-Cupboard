import { z } from "zod"

const schema = z.object({
	source: z.string(),
	inventoryCountChanges: z.array(z.object({ itemID: z.string(), countChange: z.number().int() })),
})

const validateSchema = schema.strict().required()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}
	const { source, inventoryCountChanges } = result.data

	const foundSource = await event.context.prisma.source.findUnique({
		where: {
			name: source,
		},
	})
	if (!foundSource) {
		throw createError({ statusCode: 400, statusMessage: `Source ${source} does not exist` })
	}

	const transactionResult = await event.context.prisma.$transaction(async (tx) => {
		inventoryCountChanges.forEach(async (inventoryCountChange) => {
			await tx.item.update({
				where: {
					itemID: inventoryCountChange.itemID,
				},
				data: {
					quantity: { increment: inventoryCountChange.countChange },
				},
			})
		})
		const result = await tx.itemCountChange.createManyAndReturn({
			data: inventoryCountChanges.map((inventoryCountChange) => {
				return {
					amountChanged: inventoryCountChange.countChange,
					itemID: inventoryCountChange.itemID,
					sourceName: source,
				}
			}),
		})
		return result
	})

	if (!transactionResult) {
		throw createError({ statusCode: 500, statusMessage: "Failed to process inventory count changes" })
	}

	return `Successfully processed inventory count changes: ${JSON.stringify(result)}`
})
