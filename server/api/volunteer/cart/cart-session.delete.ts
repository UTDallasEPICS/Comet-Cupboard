import { z } from "zod"
import { prisma } from "#server/utils/db"
import { StatusCodes } from "http-status-codes"
import { defineSafeHandler } from "#server/utils/handler"
import { validateBody } from "#server/utils/validation"
import { createEvent } from "#server/utils/eventsFactory"
import { publishEvent } from "#server/utils/eventBus"

const schema = z.object({ publicCode: z.string() }).strict()

export default defineSafeHandler(async (event) => {
	const { publicCode } = await validateBody(event, schema)
	const cart = await prisma.cart.findUnique({ where: { publicCode } })
	if (!cart) throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: "Cart session not found" })
	await prisma.cart.delete({ where: { publicCode } })
	publishEvent(createEvent("cartSession.removed", { publicCode }))
	return "Cart session deleted"
})
