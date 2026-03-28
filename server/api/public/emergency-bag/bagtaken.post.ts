import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { StatusCodes } from "http-status-codes"
import { BagCategory } from "~~/prisma/generated/prisma/enums"  
import { IssuedEmergencyBagItemScalarFieldEnum } from "~~/prisma/generated/prisma/internal/prismaNamespace"

const schema = z
    .object({
        label: z.string().length(5, "Bag ID must be 5 digits")
    })
    .strict()
    .required()

export default defineSafeHandler(async (event) => {
    const { label } = await validateBody(event, schema)

    return await prisma.$transaction(async (tx) => {
        const bag = await tx.emergencyBag.findUnique({
            where: { label: label },
            include: { EmergencyBagItems: true }
        })

        if (!bag) {
            throw createError({
                statusCode: StatusCodes.NOT_FOUND,
                statusMessage: `This bag with ${label} does not exist.`
            })
        }
        const issudedBag = await tx.issuedEmergencyBag.create({
            data: {
                label: bag.label,
                bagCategory: bag.bagCategory,
               location: bag.locationName || "Police Station",
                bagDescription: bag.bagDescription || "",
                expiryDate: new Date(Number(bag.expiryDate) * 1000),

                EmergencyBagItems: {
                    create: bag.EmergencyBagItems.map((item) => ({
                        itemID: item.itemID,
                        count: item.count
                    }))
                }
            }
        })

        await tx.emergencyBag.delete({
            where: { bagID: bag.bagID }
        })

        return {
            success: true,
            message: `Bag with label ${label} has been taken successfully.`,
        }
    })          
})