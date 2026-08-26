import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateQuery } from "#server/utils/validation"

const schema = z.object({ inventoryIntakeSessionID: z.string() }).strict()

export default defineSafeHandler(async (event) => {
	const { inventoryIntakeSessionID } = validateQuery(event, schema)

	return await prisma.inventoryIntakeSession.findUnique({
		where: { inventoryIntakeSessionID },
		include: {
			inventoryIntakeSessionItemChanges: {
				include: {
					specificItem: {
						include: {
							item: {
								include: { category: true, deal: true },
							},
						},
					},
				},
				orderBy: { InventoryIntakeSessionItemChangeID: "desc" },
			},
		},
	})
})
