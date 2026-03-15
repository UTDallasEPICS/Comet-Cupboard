//import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
    // TODO: Implement emergency bag retrieval logic
    const emBags = await prisma.emergencyBag.findMany({
        select: {
            bagID: true,
            Location: true,
            locationName: true,
            bagCategory: true,
            EmergencyBagItems: true,
            bagDescription: true,
            expiryDate: true,
            label: true
        }
    });
    /*
    await prisma.BAG.findMany({
        select: {
            //Whatever
        }
    });
    */

    return emBags;
})
