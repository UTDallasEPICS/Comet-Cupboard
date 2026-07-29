import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

const schema = z
	.object({
		bagID: z.string(),
		items: z.array(
			z.object({
				itemID: z.string(),
				count: z.number().int().min(1),
			})
		),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { bagID, items } = await validateBody(event, schema)

	for (const item of items) {
		await prisma.emergencyBagItem.update({
			where: {
				emergencyBagItemID: {
					bagID,
					itemID: item.itemID,
				},
			},
			data: {
				count: item.count,
			},
		})
	}
	return
})
