import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { StatusCodes } from "http-status-codes"
import { Prisma } from "../../../../prisma/generated/prisma/client"



const schema = z
    .object({
        name: z.string().min(1, "Location name cannot be empty"),
        address: z.string().min(1, "Address cannot be empty"),
    })
    .strict()
    .required()

export default defineSafeHandler(async (event) => {
    const { name, address } = await validateBody(event, schema)

    const transactionResult = await prisma.$transaction(async (tx) => {
        let location

        try {
            location = await tx.location.create({
                data: {
                    name,
                    address,
                },
            })
        } catch (error: unknown) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                throw createError({
                    statusCode: StatusCodes.CONFLICT,
                    statusMessage: "Location with this name already exists",
                })
            }
            throw error
        }

        return "Location added successfully"
    })

    return transactionResult
    
})
