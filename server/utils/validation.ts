import z from "zod"
import { StatusCodes, ReasonPhrases } from "http-status-codes"
import type { H3Event } from "h3"

const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
	const result = schema.safeParse(data)

	if (!result.success) {
		throw createError({
			statusCode: StatusCodes.BAD_REQUEST,
			statusMessage: ReasonPhrases.BAD_REQUEST,
			data: z.prettifyError(result.error),
		})
	}

	return result.data
}

export const validateBody = async <T>(event: H3Event, schema: z.ZodSchema<T>): Promise<T> => {
	const body = await readBody(event)
	return validate(schema, body)
}

export const validateQuery = <T>(event: H3Event, schema: z.ZodSchema<T>): T => {
	return validate(schema, getQuery(event))
}

export const validateParams = <T>(event: H3Event, schema: z.ZodSchema<T>): T => {
	return validate(schema, event.context.params)
}

export const validateFormData = async <T>(event: H3Event, schema: z.ZodSchema<T>): Promise<T> => {
	const formData = await readFormData(event)
	const data: Record<string, any> = {}
	
	formData.forEach((value, key) => {
		// If the key already exists and isn't an array, convert to array
		if (key in data) {
			if (!Array.isArray(data[key])) {
				data[key] = [data[key]]
			}
			data[key].push(value)
		} else {
			data[key] = value
		}
	})
	
	return validate(schema, data)
}
