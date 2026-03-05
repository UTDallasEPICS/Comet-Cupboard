import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		source: z.string(),
		inventoryCountChanges: z.array(z.object({ itemID: z.string(), countChange: z.number().int() })),
		fieldMap: z.record(z.string(), z.string()).optional(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { source, inventoryCountChanges, fieldMap } = await validateBody(event, schema)

	await prisma.$transaction(async (tx) => {
		const foundSource = await tx.source.findUnique({ where: { name: source } })
		if (!foundSource) {
			throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Source does not exist" })
		}

		for (const change of inventoryCountChanges) {
			await tx.item.update({
				where: { itemID: change.itemID },
				data: { quantity: { increment: change.countChange } },
			})
		}

		return await tx.itemCountChange.createMany({
			data: inventoryCountChanges.map((inventoryCountChange) => {
				return {
					amountChanged: inventoryCountChange.countChange,
					itemID: inventoryCountChange.itemID,
					sourceName: source,
					fieldMap: fieldMap ?? {},
				}
			}),
		})
	})

	return "Successfully processed inventory count changes"
})
