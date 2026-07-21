<template>
	<div class="flex justify-center">
		<div class="flex w-full max-w-100 flex-col gap-4">
			<UCard>
				<template #header>
					<div class="flex justify-between gap-4">
						<header class="w-full text-xl font-bold text-nowrap">Current Bag <span class="text-red-500">*</span></header>
						<div class="relative w-72">
							<UPopover v-model:open="open" :dismissible="false" :ui="{ content: 'w-(--reka-popper-anchor-width) ' }">
								<template #anchor>
									<UInput
										v-model="searchQuery"
										icon="i-lucide-search"
										variant="outline"
										class="w-full"
										placeholder="Search..."
										@focus="open = true"
										@blur="open = false"
									/>
								</template>

								<template #content>
									<div class="absolute right-0 max-h-64 w-64 overflow-y-auto bg-white">
										<div v-for="item in filteredItems" :key="item.itemID" @click="addItemToBag(item)">
											<div class="flex items-center justify-between hover:bg-gray-100">
												<div class="flex w-full cursor-pointer items-center gap-2 py-1">
													<img :src="`/api/public/image/${item.imgName}`" class="ml-2 aspect-square w-8 rounded-lg" />
													{{ item.name }}
												</div>
												<div class="flex">
													<p>Qty:</p>
													{{ item.quantity }}
												</div>
											</div>
											<USeparator />
										</div>
									</div>
								</template>
							</UPopover>
						</div>
					</div>
				</template>
				<div class="flex flex-col gap-4">
					<div v-if="bagItems.length === 0" class="flex flex-col items-center justify-center gap-y-4">
						<SharedTextBase> No items in current bag </SharedTextBase>
						<img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" />
					</div>
					<EmergencyBagItemCard
						v-for="item in bagItems"
						:key="item.itemID"
						:name="item.name"
						:img-name="item.imgName"
						:item-deal="item.itemDeal"
						:item-id="item.itemID"
						:item-count="item.count"
						:item-quantity="item.quantity"
						@increment="increaseItemCount(item.itemID)"
						@decrement="decreaseItemCount(item.itemID)"
						@remove="removeItemFromBag(item.itemID)"
					/>
				</div>
				<div class="flex justify-center">
					<p v-if="hasError" class="mt-4 text-sm text-red-500">Please add at least one item to your bag</p>
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
const searchQuery = ref("")
const open = ref(false)
const bagItems = defineModel<{
	itemID: string
	count: number
	name: string
	imgName: string
	quantity: number
}>("bagItems")

const hasError = ref(false)

watch(
	() => bagItems.value?.length,
	(newLength) => {
		if (newLength > 0) {
			hasError.value = false
		}
	}
)

defineExpose({
	validate: () => {
		hasError.value = !bagItems.value || bagItems.value.length === 0
		return !hasError.value
	},
})

const { data: itemData } = await useFetch("/api/student/inventory/items", {
	query: { checkAvailability: "true" },
})

const filteredItems = computed(() => {
	const query = searchQuery.value.toLowerCase()
	return itemData.value.filter((item) => item.name.toLowerCase().startsWith(query))
})

const addItemToBag = (item: Item) => {
	if (!bagItems.value) return
	const available = Math.max(0, item.quantity)
	if (available === 0) return
	const existingItem = bagItems.value.find((bi) => bi.itemID === item.itemID)
	if (existingItem) {
		if (existingItem.count >= available) return
		existingItem.count++
	} else {
		bagItems.value.push({
			itemID: item.itemID,
			count: 1,
			name: item.name,
			imgName: item.imgName,
			quantity: available,
		})
	}
}

const removeItemFromBag = (itemID: string) => {
	if (!bagItems.value) return
	bagItems.value = bagItems.value.filter((item) => item.itemID !== itemID)
}

const increaseItemCount = (itemID: string) => {
	if (!bagItems.value) return
	const item = bagItems.value.find((bi) => bi.itemID === itemID)
	const inventoryItem = itemData.value.find((item) => item.itemID === itemID)
	if (item && inventoryItem) {
		const available = Math.max(0, inventoryItem.quantity)
		if (item.count >= available) return
		item.count++
	}
}

const decreaseItemCount = (itemID: string) => {
	if (!bagItems.value) return
	const item = bagItems.value.find((bi) => bi.itemID === itemID)
	if (item) {
		if (item.count === 1) {
			removeItemFromBag(itemID)
		} else {
			item.count--
		}
	}
}
</script>
