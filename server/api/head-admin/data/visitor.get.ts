import { prisma } from "#server/utils/db";
import { defineSafeHandler } from "#server/utils/handler";

export default defineSafeHandler(async (event) => {
    const sessions = await prisma.user.findMany({
        include: {
            Orders: {
                select:{
                    orderID: true,
                    createdAt: true,
                    netID: true,
                }
            },
        }
    })
    
    return sessions
})