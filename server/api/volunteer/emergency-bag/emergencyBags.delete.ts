import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { StatusCodes } from "http-status-codes"

const schema = z
  .object({
    bagID: z.string(),
  })
  .strict()
  .required()

export default defineSafeHandler(async (event) => {
    try{
        const {bagID} = await validateBody(event, schema);
        console.log(bagID);
        const bag = await prisma.emergencyBag.findUnique({
            where: {bagID},
            include: {
                EmergencyBagItems: true
            }
        });

        if (!bag){
            //ERROR
            throw createError({
                statusCode: StatusCodes.NOT_FOUND,
                statusMessage: "Emergency bag not found"
            });
        }

        //Transfer to Issued Bag
        await prisma.issuedEmergencyBag.create({
            data: {
                bagID: bag.bagID,
                location: bag.locationName ?? "Activity Center", //Default??? It isnt accepting null..
                bagCategory: bag.bagCategory,
                bagDescription: bag.bagDescription,
                expiryDate: bag.expiryDate,
                label: bag.label
            }
        });

        //Transfer Items to Issued Items
        const items = bag.EmergencyBagItems.map((item) => ({
            itemID: item.itemID,
            bagID: bag.bagID,
            count: item.count
        }));

        if (items.length > 0){
            await prisma.issuedEmergencyBagItem.createMany({
                data: items
            });

            //Delete Items
            await prisma.emergencyBagItem.deleteMany({
                where: {
                    bagID
                }
            });
        }
        

        //Delete Bags
        await prisma.emergencyBag.delete({
            where: { bagID }
        });

        return { success: true };

    }catch (err){
        console.log(err);
        throw err;
    }
})
