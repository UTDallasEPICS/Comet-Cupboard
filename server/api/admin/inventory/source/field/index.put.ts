import { nanoid } from "nanoid"
import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		fieldID: z.string(),
		fieldName: z.string().min(1, "Field name cannot be empty"),
		type: z.enum(["TEXT", "NUMBER", "DATE", "BOOLEAN", "CHOICE"]),
		choices: z.array(z.string().trim().min(1)).optional(),
		optional: z.boolean(),
	})
	.strict()

export default defineSafeHandler(async (event) => {
	const { fieldID, fieldName, type, choices, optional } = await validateBody(event, schema)
	const choiceMap = type === "CHOICE" ? Object.fromEntries((choices ?? []).map((choice) => [nanoid(), choice])) : {}

	return await prisma.field.update({
		where: { fieldID },
		data: {
			fieldName,
			type,
			choices: choiceMap,
			optional,
		},
	})
})
