export const useCategories = () => {
	const getCategories = async (includeArchived = false) => {
		const { data: categories } = await useFetch("/api/student/inventory/categories", {
			query: { includeArchived },
		})
		categories.value = categories.value || []
		return categories.value
	}

	return { getCategories }
}
