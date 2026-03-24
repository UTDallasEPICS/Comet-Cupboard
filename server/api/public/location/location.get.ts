import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async () => {
    const locations = await prisma.location.findMany({
        where: {
            archived: false,
        },
        orderBy: {
            name: "asc",
        },
        include: {
            _count: {
                select: {
                    EmergencyBags: true,
                },
            },
        },
    })

    return locations
})
