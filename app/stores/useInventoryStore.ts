import { defineStore } from "pinia"

export const useInventoryStore = defineStore("inventory", () => {
	const changes = ref<Record<
		string,
		{
			oldCount: number
			newCount: number
			name: string 
			imgName: string
		}
	>>({})

	const updateItemCount = (item: {
		id: string 
		oldCount: number 
		newCount: number 
		name: string 
		imgName: string
	}) => {
		changes.value = {
			...changes.value,
			[item.id]: {
				oldCount: item.oldCount, 
				newCount: item.newCount,
				name: item.name,
				imgName: item.imgName,
			},
		}
	}

	const removeItem = (id: string) => {
		if(!changes.value[id]) return 
		const copy = { ...changes.value }
		delete copy[id]
		changes.value = copy
	}

	const resetChanges = () => {
		changes.value = {}
	}

	const changedList = computed(() => {
		return Object.entries(changes.value).map(([id, data]) => ({
			id,
			...data,
		}))
	})

	const totalChanges = computed(() => changedList.value.length)

	return {
		changes,
		updateItemCount,
		removeItem,
		resetChanges,
		changedList,
		totalChanges,
	}
})
