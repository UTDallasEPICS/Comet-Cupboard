export default defineEventHandler(async (event) => {
	const items = await event.context.prisma.item.findMany()
	if (!items) {
		throw createError({ statusCode: 500, statusMessage: "Failed to find items" })
	}
	return items
})
