export default defineSafeHandler(async (event) => {
	const name = getRouterParam(event, "name")

	if (!name) {
		throw createError({
			statusCode: 400,
			statusMessage: "Tutorial group name is required",
		})
	}

	const group = await prisma.tutorialGroup.findFirst({
		where: { name },
		include: {
			pages: {
				include: {
					steps: {
						orderBy: {
							id: "asc",
						},
					},
				},
			},
		},
	})

	if (!group) {
		throw createError({
			statusCode: 404,
			statusMessage: "Tutorial group not found",
		})
	}

	return group
})
