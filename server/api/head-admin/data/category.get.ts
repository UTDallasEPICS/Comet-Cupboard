import { prisma } from "#server/utils/db";
import { defineSafeHandler } from "#server/utils/handler";

export default defineSafeHandler(async (event) => {
    const categories = await prisma.category.findMany({
        orderBy: {
            name: "asc",
        },

        include: {
            Items: true,
        }
    })

    return categories
})