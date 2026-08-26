export default defineSafeHandler(async (event) => {
	return await prisma.tutorialGroup.findMany({
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
})
