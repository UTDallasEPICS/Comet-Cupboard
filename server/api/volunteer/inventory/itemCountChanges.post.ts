import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { Prisma } from "../../../../prisma/generated/prisma/client"

const schema = z
	.object({
		sourceID: z.string(),
		fieldMap: z.record(z.string(), z.string()).optional(),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { sourceID, fieldMap } = await validateBody(event, schema)
	const publicCode = event.context.userSession.publicCode

	const transactionResult = await prisma.$transaction(async (tx) => {
		const foundSource = await tx.source.findUnique({ where: { sourceID: sourceID } })
		if (!foundSource) {
			throw createError({ statusCode: StatusCodes.BAD_REQUEST, statusMessage: "Source does not exist" })
		}

		const inventoryChangeSession = await tx.inventoryChangeSession.findUnique({
			where: {
				publicCode: publicCode,
			},
			include: {
				InventoryChangeSessionItems: {
					include: {
						Item: true,
					},
				},
			},
		})

		if (!inventoryChangeSession) {
			throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "User does not have an inventory change session" })
		}

		for (const sessionItem of inventoryChangeSession.InventoryChangeSessionItems) {
			if (sessionItem.count === 0) {
				continue
			}
			try {
				await tx.item.update({
					where: { itemID: sessionItem.itemID },
					data: { quantity: { increment: sessionItem.count } },
				})
			} catch (error: unknown) {
				if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
					throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Item not found" })
				}
				throw error
			}
		}

		await tx.itemCountChange.createMany({
			data: inventoryChangeSession.InventoryChangeSessionItems.map((sessionItem) => {
				return {
					amountChanged: sessionItem.count,
					itemID: sessionItem.itemID,
					sourceID: sourceID,
					fieldMap: fieldMap ?? {},
				}
			}),
		})

		await tx.inventoryChangeSession.delete({
			where: {
				publicCode: publicCode,
			},
		})

		return "Successfully submitted inventory changes"
	})

	return transactionResult
})
