import type { AppEvent } from "#shared/types/events"

export const useInventoryStore = defineStore("inventory", () => {
	const intakeChangesEndpoint: string = "/api/volunteer/inventory/inventory-intake-session/item-change"
	const intakeSessionsEndpoint: string = "/api/volunteer/inventory/inventory-intake-session"
	const fetchApi = $fetch as <T>(request: string, options?: Record<string, unknown>) => Promise<T>
	const inventoryChanges = ref<Record<string, any> | null>(null)
	const selectedIntakeSessionID = ref<string | null>(null)
	const activeIntakeSessions = ref<any[]>([])
	const inventoryDrawerOpen = ref(false)

	const getInventoryChanges = async () => {
		if (!selectedIntakeSessionID.value) {
			inventoryChanges.value = null
			return
		}
		try {
			inventoryChanges.value = await fetchApi<Record<string, any>>(intakeChangesEndpoint, {
				query: { inventoryIntakeSessionID: selectedIntakeSessionID.value },
			})
		} catch (e) {
			inventoryChanges.value = null
		}
	}

	const getActiveIntakeSessions = async () => {
		activeIntakeSessions.value = await fetchApi<any[]>(intakeSessionsEndpoint)
	}

	const selectIntakeSession = async (inventoryIntakeSessionID: string) => {
		selectedIntakeSessionID.value = inventoryIntakeSessionID
		await getInventoryChanges()
	}

	const clearIntakeSession = () => {
		selectedIntakeSessionID.value = null
		inventoryChanges.value = null
	}

	const inventoryChangesItems = computed(() => {
		if (!inventoryChanges.value || "inventoryIntakeSessionItemChanges" in inventoryChanges.value === false) {
			return []
		}
		return [...inventoryChanges.value.inventoryIntakeSessionItemChanges].sort((first: any, second: any) =>
			second.InventoryIntakeSessionItemChangeID.localeCompare(first.InventoryIntakeSessionItemChangeID)
		)
	})

	const inventoryChangesItemsCategorized = computed(() => {
		if (!inventoryChanges.value || "inventoryIntakeSessionItemChanges" in inventoryChanges.value === false) {
			return {}
		}

		const items = inventoryChangesItems.value

		return Object.groupBy(items, (change: any) => change.specificItem.item.category.categoryName) as Record<string, any[]>
	})

	const inventoryChangesItemsAggregatedCategorized = computed(() => {
		const changesBySpecificItem = new Map<string, any>()
		for (const change of inventoryChangesItems.value) {
			const existingChange = changesBySpecificItem.get(change.specificItemID)
			if (existingChange) existingChange.amountChanged += change.amountChanged
			else changesBySpecificItem.set(change.specificItemID, { ...change })
		}
		return Object.groupBy([...changesBySpecificItem.values()], (change: any) => change.specificItem.item.category.categoryName) as Record<string, any[]>
	})

	const numberOfChanges = computed(() => {
		if (!inventoryChanges.value || "inventoryIntakeSessionItemChanges" in inventoryChanges.value === false) {
			return 0
		}
		return inventoryChanges.value.inventoryIntakeSessionItemChanges.length
	})

	const hasInventoryChanges = computed(() => {
		return numberOfChanges.value > 0
	})

	const changeInventorySessionItemCount = async (specificItemID: string, increment: number) => {
		if (!selectedIntakeSessionID.value) {
			inventoryDrawerOpen.value = true
			return
		}
		try {
			await $fetch(intakeChangesEndpoint, {
				method: "POST",
				body: {
					specificItemID,
					incrementChange: increment,
					inventoryIntakeSessionID: selectedIntakeSessionID.value,
				},
			})
		} catch (e) {
			// idk
		}
		await getInventoryChanges()
	}

	const handleIntakeSessionEvent = async (event: AppEvent) => {
		if (event.type !== "inventoryIntakeSession.specificItemAmountChange" && event.type !== "inventoryIntakeSession.submitted") return

		if (event.payload.inventoryIntakeSessionID === selectedIntakeSessionID.value) {
			await getInventoryChanges()
		}
		if (event.type === "inventoryIntakeSession.submitted" && event.payload.inventoryIntakeSessionID === selectedIntakeSessionID.value) {
			selectedIntakeSessionID.value = null
			inventoryChanges.value = null
			await getActiveIntakeSessions()
		}
	}

	const submitChanges = async () => {
		if (!selectedIntakeSessionID.value) return
		try {
			await $fetch("/api/volunteer/inventory/inventory-intake-session/submit", {
				method: "POST",
				body: { inventoryIntakeSessionID: selectedIntakeSessionID.value },
			})
			selectedIntakeSessionID.value = null
			inventoryChanges.value = null
			await getActiveIntakeSessions()
		} catch (e) {}
	}

	return {
		inventoryChanges,
		selectedIntakeSessionID,
		activeIntakeSessions,
		inventoryDrawerOpen,
		getInventoryChanges,
		getActiveIntakeSessions,
		selectIntakeSession,
		clearIntakeSession,
		inventoryChangesItems,
		inventoryChangesItemsCategorized,
		inventoryChangesItemsAggregatedCategorized,
		hasInventoryChanges,
		numberOfChanges,
		changeInventorySessionItemCount,
		handleIntakeSessionEvent,
		submitChanges,
	}
})
