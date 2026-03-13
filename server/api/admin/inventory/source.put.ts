import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		sourceID: z.string().default(""),
		name: z.string().min(1, "Name cannot be empty"),
		archived: z.boolean(),
	})
	.strict()
	.partial({
		name: true,
		archived: true,
	})
	.refine(
		({ sourceID, name, archived }) => {
			if (sourceID === "") {
				// creating a new source, so all fields are required
				if (!name || archived === undefined) {
					return false
				}
			}
			return true
		},
		{
			error: "name and archived are required when creating a new source",
		}
	)

export default defineSafeHandler(async (event) => {
	const { sourceID, name, archived } = await validateBody(event, schema)

	await prisma.source.upsert({
		where: {
			sourceID: sourceID,
		},
		update: {
			...(name && { name }),
			...(archived !== undefined && { archived }),
		},
		create: {
			name: name,
			archived: archived,
		},
	})

	return "Successfully added/updated source"
})
