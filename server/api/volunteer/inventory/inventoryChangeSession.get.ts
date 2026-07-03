import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const publicCode = event.context.userSession.publicCode

	const inventoryChangeSession = await prisma.inventoryChangeSession.findUnique({
		where: {
			publicCode: publicCode,
		},
		include: {
			InventoryChangeSessionItems: {
				include: {
					Item: {
						include: {
							Deal: true,
						},
					},
				},
			},
		},
	})

	if (!inventoryChangeSession) {
		throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "User does not have an inventory change session" })
	}

	return inventoryChangeSession
})
