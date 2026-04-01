import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { StatusCodes } from "http-status-codes"

const schema = z.object({
  bagID: z.string(),
  location: z.string()
}).strict()

export default defineSafeHandler(async (event) => {
    const { bagID, location } = await validateBody(event, schema);

    const locationExists = await prisma.location.findUnique({
      where: { name: location }
    });

    if (!locationExists) {
      throw createError({
        statusCode: StatusCodes.NOT_FOUND,
        statusMessage: "Location not found"
      });
    }

    const bag = await prisma.emergencyBag.findUnique({
      where: { bagID }
    });

    if (!bag) {
      throw createError({
        statusCode: StatusCodes.NOT_FOUND,
        statusMessage: "Emergency bag not found"
      });
    }

    await prisma.emergencyBag.update({
      where: { bagID },
      data: {
        locationName: location
      }
    });

    return { success: true };
})
