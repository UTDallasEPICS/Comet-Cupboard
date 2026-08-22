import { StatusCodes } from "http-status-codes"

export default defineSafeHandler(async (event) => {
	const group = await prisma.tutorialGroup.findUnique({
		where: { tutorialGroupName: "Head Admin" },
		include: {
			tutorials: {
				include: {
					tutorialSteps: {
						orderBy: {
							stepOrdering: "asc",
						},
					},
				},
			},
		},
	})

	if (!group) {
		throw createError({
			statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
			statusMessage: "Head admin tutorial group not found",
		})
	}

	return group
})
