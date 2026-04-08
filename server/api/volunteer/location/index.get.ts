import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async () => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: "asc" },
    })
    return locations
  } catch (err) {
      throw err
  }
})