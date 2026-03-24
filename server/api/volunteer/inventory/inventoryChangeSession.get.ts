import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	const netID = event.context.user.netID

	const inventoryChangeSession = await prisma.inventoryChangeSession.findUnique({
		where: {
			netID: netID,
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
