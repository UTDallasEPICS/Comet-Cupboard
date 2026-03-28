import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { StatusCodes } from "http-status-codes"

const schema = z.object({
  bagIDs: z.array(z.string()).min(1),
  location: z.string()
}).strict()

export default defineSafeHandler(async (event) => {
    const { bagIDs, location } = await validateBody(event, schema);

    const locationExists = await prisma.location.findUnique({
      where: { name: location }
    });

    if (!locationExists) {
      throw createError({
        statusCode: StatusCodes.NOT_FOUND,
        statusMessage: "Location not found"
      });
    }

    const bags = await prisma.emergencyBag.findMany({
      where: {
        bagID: { in: bagIDs }
      },
      select: { bagID: true }
    })

    if (bags.length !== bagIDs.length) {
      throw createError({
        statusCode: StatusCodes.NOT_FOUND,
        statusMessage: "One or more bags not found"
      })
    }
    
    await prisma.emergencyBag.updateMany({
      where: {
        bagID: { in: bagIDs }
      },
      data: {
        locationName: location
      }
    })


    return { success: true };
})
