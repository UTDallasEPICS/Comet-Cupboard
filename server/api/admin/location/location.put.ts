import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { Prisma } from "../../../../prisma/generated/prisma/client"

const schema = z
	.object({
		originalName: z.string().min(1, "Original name is required"),
		name: z.string().min(1, "Location name cannot be empty").optional(),
		address: z.string().min(1, "Address cannot be empty").optional(),
		archived: z.boolean().optional(),
	})
	.strict()
	.refine(
		({ name, address, archived }) => {
			//must update at least one field
			return name !== undefined || address !== undefined || archived !== undefined
		},
		{
			message: "categoryName, archived, and image are required when creating a new category",
		}
	)

export default defineSafeHandler(async (event) => {
	const { originalName, name, address, archived } = await validateBody(event, schema)

	const existingLocation = await prisma.location.findUnique({
		where: { name: originalName },
	})

	if (!existingLocation) {
		throw createError({
			statusCode: StatusCodes.NOT_FOUND,
			statusMessage: "Location does not exist",
		})
	}
	try {
		let location
			//Handle primary key change
		if (name && name !== originalName) {
			await prisma.location.delete({
				where: { name: originalName },
			})

			location = await prisma.location.create({
				data: {
					name,
					address: address ?? existingLocation.address,
					archived: archived ?? existingLocation.archived,
				},
			})
		} else {
			location = await prisma.location.update({
				where: { name: originalName },
				data: {
					...(name !== undefined && { name }),
					...(address !== undefined && { address }),
					...(archived !== undefined && { archived }),
				},
			})
		}

		return location
	} catch (error: unknown) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2025"
		) {
			throw createError({
			statusCode: StatusCodes.NOT_FOUND,
				statusMessage: "Location not found",
			})
		}

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

})