export const useTutorialForGroup = (groupName: string) => {
	return useFetch(`/api/public/tutorial/group/${groupName}`, {
		transform: (group) => {
			if (!group) {
				return undefined
			}

			return {
				title: `${group.name} Tutorials`,
				tutorialPages: (group.pages ?? []).map((page) => ({
					title: page.name,
					content: (page.steps ?? []).map((step) => ({
						imageURL: step.imageURL,
						description: step.description,
					})),
				})),
			}
		},
	})
}
