import { nanoid } from "nanoid"
import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { sourceFieldSchema } from "#shared/utils/formSchemas"

const schema = sourceFieldSchema.extend({ sourceID: z.string() }).strict()

export default defineSafeHandler(async (event) => {
	const { sourceID, fieldName, type, choices, optional } = await validateBody(event, schema)

	const choiceMap = type === "CHOICE" ? Object.fromEntries((choices ?? []).map((choice) => [nanoid(), choice])) : {}

	await prisma.field.create({
		data: {
			fieldName,
			sourceID,
			type,
			choices: choiceMap,
			optional,
		},
	})

	return "Field added successfully"
})
