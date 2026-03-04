import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"

const schema = z.object({
	source: z.string(),
	inventoryCountChanges: z.array(z.object({ itemID: z.string(), countChange: z.number().int() })),
	fieldMap: z.record(z.string(), z.string()).optional(),
})

const validateSchema = schema.strict()

export default defineEventHandler(async (event) => {
	const result = await readValidatedBody(event, (body) => validateSchema.safeParse(body))
	if (!result.success) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Invalid request body" })
	}
	const { source, inventoryCountChanges, fieldMap } = result.data

	const foundSource = await prisma.source.findUnique({
		where: {
			name: source,
		},
	})
	if (!foundSource) {
		throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: `Source ${source} does not exist` })
	}

	const transactionResult = await prisma.$transaction(async (tx) => {
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
					fieldMap: fieldMap ?? {},
				}
			}),
		})
		return result
	})

	if (!transactionResult) {
		throw createError({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, statusMessage: "Failed to process inventory count changes" })
	}

	return `Successfully processed inventory count changes: ${JSON.stringify(result)}`
})
