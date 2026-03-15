//import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
    // TODO: Implement emergency bag retrieval logic
    const emBags = [];
    /*
    await prisma.BAG.findMany({
        select: {
            //Whatever
        }
    });
    */

    return emBags;
})
