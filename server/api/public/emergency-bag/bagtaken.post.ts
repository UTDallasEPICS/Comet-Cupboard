import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { StatusCodes } from "http-status-codes"

const schema = z
	.object({
		label: z.string().length(5, "Bag ID must be 5 digits"),
	})
	.strict()
	.required()

export default defineSafeHandler(async (event) => {
	const { label } = await validateBody(event, schema)

	const transactionResult = await prisma.$transaction(async (tx) => {
		const bag = await tx.emergencyBag.findUnique({
			where: { label: label },
			include: { EmergencyBagItems: true },
		})

		if (!bag) {
			throw createError({
				statusCode: StatusCodes.NOT_FOUND,
				statusMessage: `This bag with ${label} does not exist.`,
			})
		}
		if (!bag.locationName) {
			throw createError({
				statusCode: StatusCodes.BAD_REQUEST,
				statusMessage: "Bag does not have a location assigned yet.",
			})
		}

		await tx.issuedEmergencyBag.create({
			data: {
				label: bag.label,
				bagCategory: bag.bagCategory,
				location: bag.locationName!,
				bagDescription: bag.bagDescription || "",
				expiryDate: bag.expiryDate,

				EmergencyBagItems: {
					create: bag.EmergencyBagItems.map((item) => ({
						itemID: item.itemID,
						count: item.count,
					})),
				},
			},
		})

		await tx.emergencyBag.delete({
			where: { bagID: bag.bagID },
		})

		return {
			success: true,
			message: `Bag with label ${label} has been taken successfully.`,
		}
	})

	return transactionResult
})
