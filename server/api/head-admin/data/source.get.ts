import { prisma } from "#server/utils/db";
import { defineSafeHandler } from "#server/utils/handler";

export default defineSafeHandler(async (event) => {
    const sources = await prisma.source.findMany({
        orderBy: {
            name: "asc",
        },

        include: {
            ItemCountChanges: true,
        }
    })

    return sources
})