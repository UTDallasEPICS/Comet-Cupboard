import { prisma } from "#server/utils/db";
import { defineSafeHandler } from "#server/utils/handler";

export default defineSafeHandler(async (event) => {
    const sources = await prisma.source.findMany({
        orderBy: {
            name: "asc",
        },

        include: {
            ItemCountChanges: {
                select: {
                    date: true,
                    amountChanged: true,
                    Item: {
                        select: {
                            name: true,
                            categoryName: true,
                            quantity: true,
                        }
                    },
                },
            }
        }
    })

    return sources
})