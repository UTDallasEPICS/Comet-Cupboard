export const useInventoryStore = defineStore("inventory", () => {
	const inventoryChanges = ref<Record<string, any> | null>(null)

	const getInventoryChanges = async () => {
		try {
			inventoryChanges.value = await $fetch("/api/volunteer/inventory/inventoryChangeSession")
		} catch (e) {
			inventoryChanges.value = null
		}
	}

	const inventoryChangesItems = computed(() => {
		if (inventoryChanges.value === null || "InventoryChangeSessionItems" in inventoryChanges.value === false) {
			return []
		}
		return inventoryChanges.value.InventoryChangeSessionItems
	})

	const numberOfChanges = computed(() => {
		if (inventoryChanges.value === null || "InventoryChangeSessionItems" in inventoryChanges.value === false) {
			return 0
		}
		return inventoryChanges.value.InventoryChangeSessionItems.length
	})

	const changeInventorySessionItemCount = async (itemID: string, increment: number) => {
		try {
			await $fetch("/api/volunteer/inventory/inventoryChangeSessionItem", {
				method: "POST",
				body: {
					itemID: itemID,
					incrementChange: increment,
				},
			})
		} catch (e) {
			// idk
		}
		await getInventoryChanges()
	}

	const submitChanges = async (sourceID: string, fieldMap?: Record<string, string>) => {
		try {
			await $fetch("/api/volunteer/inventory/itemCountChanges", {
				method: "POST",
				body: {
					sourceID: sourceID,
					fieldMap: fieldMap,
				},
			})
			await getInventoryChanges()
			await navigateTo("/volunteer/inventory")
			reloadNuxtApp()
		} catch (e) {}
	}

	return {
		inventoryChanges,
		getInventoryChanges,
		inventoryChangesItems,
		numberOfChanges,
		changeInventorySessionItemCount,
		submitChanges,
	}
})
