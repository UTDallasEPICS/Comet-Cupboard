import type { H3Event } from "h3"
import { StatusCodes, ReasonPhrases } from "http-status-codes"

export const defineSafeHandler = (fn: (event: H3Event) => Promise<any>) => {
	return defineEventHandler(async (event) => {
		try {
			return await fn(event)
		} catch (error: any) {
			// If the error already has a status code, assume it's a well-formed error and pass it through
			if (error.statusCode) {
				throw error
			}

			throw createError({
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
				statusMessage: ReasonPhrases.INTERNAL_SERVER_ERROR,
			})
		}
	})
}
