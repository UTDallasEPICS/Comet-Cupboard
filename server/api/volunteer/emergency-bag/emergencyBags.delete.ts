import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
  .object({
    bagIDs: z.array(z.string()),
  })
  .strict()
  .required()

export default defineSafeHandler(async (event) => {
    try{
        const {bagIDs} = await validateBody(event, schema);
        const bags = await prisma.emergencyBag.findMany({
            where: {
                bagID: {in: bagIDs}
            },
            include: {
                EmergencyBagItems: true
            }
        });

        if (bags.length == 0){
            return bags;
        }

        //Transfer to Issued Bag
        await prisma.issuedEmergencyBag.createMany({
            data: bags.map((bag)=>({
                bagID: bag.bagID,
                location: bag.locationName ?? "Activity Center", //Default??? It isnt accepting null..
                bagCategory: bag.bagCategory,
                bagDescription: bag.bagDescription,
                expiryDate: bag.expiryDate,
                label: bag.label
            }))
        });

        //Transfer Items to Issued Items
        const allItems = bags.flatMap((bag) =>
            bag.EmergencyBagItems.map((item) => ({
                itemID: item.itemID,
                bagID: bag.bagID,
                count: item.count
            }))
        );
        await prisma.issuedEmergencyBagItem.createMany({
            data: allItems
        });

        //Delete Items
        await prisma.emergencyBagItem.deleteMany({
            where: {
                bagID: { in: bagIDs }
            }
        });

        //Delete Bags
        await prisma.emergencyBag.deleteMany({
            where: {
                bagID: { in: bagIDs }
            }
        });

    }catch (err){
        console.log(err);
        return [];
    }
    


    return [];
})
