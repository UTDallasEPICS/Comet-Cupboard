import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { Prisma } from "~~/prisma/generated/prisma/client"

const schema = z
	.object({
		itemID: z.string(),
		incrementChange: z.int(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { itemID, incrementChange } = await validateBody(event, schema)
	const publicCode = event.context.userSession.publicCode

	if (incrementChange === 0) {
		return "No changes made"
	}

	const transactionResult = await prisma.$transaction(async (tx) => {
		let inventoryChangeSession
		inventoryChangeSession = await tx.inventoryChangeSession.findUnique({
			where: { publicCode: publicCode },
		})
		if (!inventoryChangeSession) {
			// create inventory change session if it doesn't exist
			inventoryChangeSession = await tx.inventoryChangeSession.create({
				data: { publicCode: publicCode },
			})
		}
		try {
			const inventoryChangeSessionItem = await tx.inventoryChangeSessionItem.upsert({
				where: {
					inventoryChangeSessionItemID: {
						publicCode: publicCode,
						itemID: itemID,
					},
				},
				update: { count: { increment: incrementChange } },
				create: {
					publicCode: publicCode,
					itemID: itemID,
					count: incrementChange,
				},
			})

			if (inventoryChangeSessionItem.count == 0) {
				await tx.inventoryChangeSessionItem.delete({
					where: {
						inventoryChangeSessionItemID: {
							publicCode: publicCode,
							itemID: itemID,
						},
					},
				})
			}
			return "Successfully updated inventory change session item"
		} catch (error: unknown) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
				throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Item not found" })
			}
			throw error
		}
	})

	return transactionResult
})
