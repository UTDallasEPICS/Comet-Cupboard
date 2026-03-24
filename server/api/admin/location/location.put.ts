import { createEvent } from "#server/utils/eventsFactory"
import { publishEvent } from "#server/utils/eventBus"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { Prisma } from "../../../../prisma/generated/prisma/client"

export default defineSafeHandler(async (event) => {
	const name = event.context.location.name

	const updateLocation = await prisma.$transaction(async (tx) => {
		const location = await tx.location.findUnique({
			where: {
				name: name,
				archived: false,
			},
		})
		if (!location) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Location not found" })
		}

		try {
			const updateLocation = await tx.location.update({
				where: {
					name: location.name,
				},
				data: {
					archived: true,
				},
			})
			return updateLocation
		} catch (error: unknown) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
				throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Location not found" })
			}
			throw error
		}
	})

	return "Successfully archived location"
})
