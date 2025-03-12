export default defineEventHandler(async (event) => {
	try {
		const volunteers = await event.context.prisma.volunteer.findMany()
		return volunteers
	} catch (error) {
		throw createError({ statusCode: 500, statusMessage: "Failed to fetch volunteers" })
	}
})
