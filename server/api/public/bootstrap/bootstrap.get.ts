import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import type { BootstrapData } from "#shared/types/bootstrap"

// Big chunky API to fetch initial client data
export default defineSafeHandler(async (event) => {
	const bootstrapData: BootstrapData = {
		permissions: event.context.permissions,
		userSession: null,
		publicQueue: null,
		queueStatus: null,
		cart: null,
	}

	bootstrapData.permissions = event.context.permissions

	if (event.context.userSession) {
		bootstrapData.userSession = event.context.userSession
		const publicCode = event.context.userSession.publicCode

		await prisma.$transaction(async (tx) => {
			const existingEntry = await tx.queueEntry.findUnique({
				where: { publicCode: publicCode },
			})

			if (existingEntry) {
				bootstrapData.queueStatus = {
					position: existingEntry.position,
					publicCode: existingEntry.publicCode,
					publicIcon: event.context.userSession.publicIcon,
				}
			} else {
				const cart = await tx.cart.findUnique({
					where: {
						publicCode: publicCode,
					},
					include: {
						CartItems: {
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
				if (cart) {
					bootstrapData.cart = cart
				}
			}

			const queue = await tx.queueEntry.findMany({
				orderBy: { position: "asc" },
				select: {
					position: true,
					publicCode: true,
					UserSession: {
						select: {
							publicIcon: true,
						},
					},
				},
			})
			const formattedQueue = queue.map((entry) => ({
				position: entry.position,
				publicCode: entry.publicCode,
				publicIcon: entry.UserSession.publicIcon,
			}))
			bootstrapData.publicQueue = formattedQueue

			return "Transaction completed successfully"
		})
	}

	return bootstrapData
})
