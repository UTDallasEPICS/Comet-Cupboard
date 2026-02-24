import { defineStore } from "pinia"

interface QuantityChange {
	quantity: number
	countChange: number
}

export const useInventoryStore = defineStore("inventory", () => {
	const quantityChanges = ref<Record<string, QuantityChange>>({})

	const quantityItemsChanged = computed(() => {
		return Object.keys(quantityChanges.value).length
	})

	const reviewChangesView = ref(false)

	const resetReviewChangesView = () => {
		reviewChangesView.value = false
	}

	const getQuantityChange = (itemID: string) => {
		if (!Object.keys(quantityChanges.value).includes(itemID)) {
			return {
				quantity: 0,
				countChange: 0,
			}
		} else {
			return quantityChanges.value[itemID]
		}
	}

	const updateQuantityChange = (payload: { itemID: string; quantity: number; countChange: number }) => {
		const { itemID, quantity, countChange } = payload

		if (!Object.keys(quantityChanges.value).includes(itemID)) {
			quantityChanges.value[itemID] = {
				quantity: quantity,
				countChange: countChange,
			}
			return
		}

		if (countChange === 0) {
			delete quantityChanges.value[itemID]
			return
		}

		quantityChanges.value[itemID] = {
			quantity: quantityChanges.value[itemID].quantity + countChange,
			countChange: countChange,
		}
	}

	const resetQuantityChanges = () => {
		quantityChanges.value = {}
	}

	const submitChanges = async (source: string, fieldMap?: Record<string, string>) => {
		try {
			await $fetch("/api/volunteer/inventory/itemCountChanges", {
				method: "POST",
				body: {
					source: source,
					inventoryCountChanges: Object.entries(quantityChanges.value).map(([itemID, change]) => {
						return {
							itemID: itemID,
							countChange: change.countChange,
						}
					}),
					fieldMap: fieldMap,
				},
			})
			resetQuantityChanges()
			await navigateTo("/volunteer/inventory")
			reloadNuxtApp()
			resetReviewChangesView()
		} catch (e) {}
	}

	return {
		quantityChanges,
		quantityItemsChanged,
		updateQuantityChange,
		resetQuantityChanges,
		submitChanges,
		reviewChangesView,
		resetReviewChangesView,
		getQuantityChange,
	}
})
