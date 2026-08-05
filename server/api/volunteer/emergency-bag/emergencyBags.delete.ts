import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
    .object({
        bagIDs: z.array(z.string()).min(1),
    })
    .strict()

export default defineSafeHandler(async (event) => {
    const { bagIDs } = await validateBody(event, schema)

    const deleteBag = await prisma.emergencyBag.deleteMany({
        where: {
            label: { in: bagIDs },
        },
    })

    return deleteBag
})
