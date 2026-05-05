import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
  .object({
    bagID: z.string(),

    bagCategory: z.enum([
      "VEGETARIAN_AND_PEANUT_BUTTER",
      "VEGETARIAN_AND_NON_PEANUT_BUTTER",
      "NONVEGETARIAN_AND_PEANUT_BUTTER",
      "NONVEGETARIAN_AND_NON_PEANUT_BUTTER",
    ]),

    expiryDate: z.string().datetime(),

    items: z.array(
      z.object({
        itemID: z.string(),
        count: z.number().int().min(1),
      })
    ),

    oldItems: z.array(
      z.object({
        itemID: z.string(),
        count: z.number().int().min(0),
      })
    ),

    isPrivate: z.boolean().optional().default(false),
  })
  .strict()
  .required()

export default defineSafeHandler(async (event) => {
  const { bagID, bagCategory, expiryDate, items, oldItems, isPrivate } =
    await validateBody(event, schema)

  return await prisma.$transaction(async (tx) => {
    const existingBag = await tx.emergencyBag.findUnique({
      where: { bagID },
      include: { EmergencyBagItems: true }
    })

    if (!existingBag) {
      throw createError({
        statusCode: StatusCodes.NOT_FOUND,
        statusMessage: "Bag not found"
      })
    }

    const originalMap = new Map(
      existingBag.EmergencyBagItems.map(i => [i.itemID, i.count])
    )

    for (const item of oldItems) {
      const original = originalMap.get(item.itemID) ?? 0

      if (item.count > original) {
        throw createError({
          statusCode: StatusCodes.BAD_REQUEST,
          statusMessage: `Invalid count for item ${item.itemID}`
        })
      }
    }

    //Validate inventory for new items
    for (const item of items) {
      const dbItem = await tx.item.findUnique({
        where: { itemID: item.itemID }
      })

      if (!dbItem || dbItem.quantity < item.count) {
        throw createError({
          statusCode: StatusCodes.BAD_REQUEST,
          statusMessage: `Not enough inventory for ${item.itemID}`
        })
      }
    }

    //Decrement inventory ONLY for new items
    for (const item of items) {
      await tx.item.update({
        where: { itemID: item.itemID },
        data: {
          quantity: {
            decrement: item.count
          }
        }
      })
    }

    //Merge old + new items
    const mergedMap = new Map<string, number>()

    for (const item of oldItems) {
      mergedMap.set(item.itemID, item.count)
    }

    for (const item of items) {
      mergedMap.set(
        item.itemID,
        (mergedMap.get(item.itemID) ?? 0) + item.count
      )
    }

    const finalItems = Array.from(mergedMap.entries()).map(
      ([itemID, count]) => ({
        bagID,
        itemID,
        count
      })
    )

    await tx.emergencyBagItem.deleteMany({
      where: { bagID }
    })

    await tx.emergencyBagItem.createMany({
      data: finalItems
    })

    //Update bag metadata
    const updatedBag = await tx.emergencyBag.update({
      where: { bagID },
      data: {
        bagCategory,
        expiryDate: new Date(expiryDate),
        private: isPrivate
      },
      include: {
        EmergencyBagItems: true
      }
    })

    return updatedBag
  })
})