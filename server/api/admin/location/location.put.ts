import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateFormData } from "#server/utils/validation"
import { Prisma } from "../../../../prisma/generated/prisma/client"
import { imageSchema, deleteImage, uploadImage, processImage } from "#server/utils/image"

const schema = imageSchema
    .extend({
        originalName: z.string().default(""),
        name: z.string().min(1, "Location name cannot be empty"),
        address: z.string().min(1, "Address cannot be empty"),
        description: z.string().url("Must be a valid URL").or(z.literal("")),
        archived: z.enum(["true", "false"]),
    })
    .strict()
    .partial({
        name: true,
        address: true,
        description: true,
        archived: true,
        image: true,
    })
    .refine(
        ({ originalName, name, address, archived, image }) => {
            if (originalName === "") {
                if (!name || !address || !archived || !image) {
                    return false
                }
            }
            return true
        },
        {
            message: "name, address, archived, and image are required when creating a new location",
        }
    )

export default defineSafeHandler(async (event) => {
    const { originalName, name, address, description, archived, image } = await validateFormData(event, schema)

    const result = await prisma.$transaction(async (tx) => {
        let oldImgName = ""
        
        if (originalName) {
            const existingLocation = await tx.location.findUnique({ where: { name: originalName } })
            if (!existingLocation) {
                throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Location does not exist" })
            }
            oldImgName = existingLocation.imgName
        }

        let newImgName = undefined
        if (image) {
            newImgName = await uploadImage(await processImage(Buffer.from(await image.arrayBuffer())))
        }

        let location
        if (originalName) {
            try {
                if (name && name !== originalName) {
                    await tx.location.delete({ where: { name: originalName } })
                    location = await tx.location.create({
                        data: {
                            name: name,
                            address: address || "", 
                            imgName: newImgName || oldImgName,
                            description: description || "",
                            archived: archived === "true",
                        }
                    })
                } else {
                    location = await tx.location.update({
                        where: { name: originalName },
                        data: {
                            ...(name !== undefined && { name }),
                            ...(address !== undefined && { address }),
                            ...(description !== undefined && { description }),
                            ...(newImgName !== undefined && { imgName: newImgName }),
                            ...(archived !== undefined && { archived: archived === "true" }),
                        },
                    })
                }
            } catch (error: unknown) {
                if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                    throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Location not found" })
                }
                throw error
            }
        } else {
            location = await tx.location.create({
                data: { 
                    name: name!, 
                    address: address!, 
                    imgName: newImgName!, 
                    description: description || "", 
                    archived: archived === "true" 
                },
            })
        }

        if (oldImgName && newImgName) {
            await deleteImage(oldImgName)
        }
        
        return location
    })

    return "Successfully updated/created location"
})