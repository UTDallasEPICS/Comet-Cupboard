import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { claimEmergencyBagSchema } from "#shared/utils/formSchemas"
import { StatusCodes } from "http-status-codes"

const schema = claimEmergencyBagSchema.strict()

export default defineSafeHandler(async (event) => {
	const { label } = await validateBody(event, schema)

	const transactionResult = await prisma.$transaction(async (tx) => {
		const bag = await tx.emergencyBag.findUnique({
			where: { label: label, private: false },
			include: { emergencyBagItems: true, emergencyBagLabels: true },
		})

		if (!bag) {
			throw createError({
				statusCode: StatusCodes.NOT_FOUND,
				statusMessage: `This bag with ${label} does not exist.`,
			})
		}

		await tx.issuedEmergencyBag.create({
			data: {
				label: bag.label,
				locationID: bag.locationID,
				private: bag.private,
				bagDescription: bag.bagDescription,
				expiryDate: bag.expiryDate,

				issuedEmergencyBagItems: {
					create: bag.emergencyBagItems.map((item) => ({
						specificItemID: item.specificItemID,
						count: item.count,
					})),
				},
				issuedEmergencyBagLabels: { connect: bag.emergencyBagLabels.map((label) => ({ emergencyBagLabelID: label.emergencyBagLabelID })) },
			},
		})

		await tx.emergencyBag.delete({
			where: { emergencyBagID: bag.emergencyBagID },
		})

		return {
			success: true,
			message: `Bag with label ${label} has been taken successfully.`,
		}
	})

	return transactionResult
})
