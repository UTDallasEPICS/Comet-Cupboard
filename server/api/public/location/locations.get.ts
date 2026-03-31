import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async () => {
  try {

    //Apply conditional filtering
    const locations = await prisma.location.findMany({
      orderBy: { name: "asc" },
    })

    //Count emergency bags per location & category
    const bagCounts = await prisma.emergencyBag.groupBy({
      by: ['locationName', 'bagCategory'],
      _count: { bagID: true },
    })

    //Map counts to each location
    const result = locations.map(loc => {
      const categoryCounts: Record<string, number> = {}

      bagCounts
        .filter(b => b.locationName === loc.name)
        .forEach(b => {
          categoryCounts[b.bagCategory] = b._count.bagID
        })

      //Total number of bags
      const totalBags = Object.values(categoryCounts).reduce((a, b) => a + b, 0)

      return {
        name: loc.name,
        address: loc.address,
        emergencyBags: totalBags,
        archived: loc.archived, 
        categoryCounts,
      }
    })

    return result
  } catch (err) {
      console.error("API ERROR:", err)
      throw err
  }
})