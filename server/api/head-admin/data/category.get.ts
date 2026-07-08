import { prisma } from "#server/utils/db";
import { defineSafeHandler } from "#server/utils/handler";

export default defineSafeHandler(async (event) => {
    const items = await prisma.item.findMany({
        orderBy: {
            name: "asc",
        },
    })

    const rows = items.map((row) => {
        return {
            itemCategory: row.categoryName,
            itemName: row.name,
            itemQuantity: row.quantity
        }
    })

    const categoryTotal = {}

    for (const {itemCategory, itemName, itemQuantity} of rows){
        if (!(itemCategory in categoryTotal)){
            categoryTotal[itemCategory] = {}
        }

        categoryTotal[itemCategory][itemName] = itemQuantity
    }

    return categoryTotal
})