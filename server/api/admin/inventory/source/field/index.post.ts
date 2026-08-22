import { nanoid } from "nanoid"
import { z } from "zod"
import { prisma } from "#server/utils/db"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"

const schema = z
	.object({
		sourceID: z.string(),
		fieldName: z.string().min(1, "Field name cannot be empty"),
		type: z.enum(["TEXT", "NUMBER", "DATE", "BOOLEAN", "CHOICE"]),
		choices: z.array(z.string().trim().min(1)).optional(),
		optional: z.boolean().default(false),
	})
	.strict()
	.refine((value) => value.type !== "CHOICE" || Boolean(value.choices?.length), {
		message: "Choice fields require at least one value",
		path: ["choices"],
	})

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
