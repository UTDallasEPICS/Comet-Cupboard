import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async () => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: "asc" },
    })

    return locations
  } catch (err) {
      console.error("API ERROR:", err)
      throw err
  }
})