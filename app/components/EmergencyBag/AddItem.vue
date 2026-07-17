<template>
	<div class="flex justify-center">
		<div class="flex w-full max-w-100 flex-col gap-4">
			<UCard>
				<template #header>
					<div class="flex justify-between">
						<h2 class="text-xl font-bold">Current Bag</h2>
						<UPopover
							:content="{
								align: 'end',
								side: 'bottom',
							}"
						>
							<UButton class="bg-utd-green rounded-lg px-4 py-2"> Add Items</UButton>
							<template #content>
								<UInput v-model="searchQuery" icon="i-lucide-search" variant="outline" class="w-full" placeholder="Search..." />
								<div class="max-h-64 w-64 overflow-y-auto">
									<div v-for="item in filteredItems" :key="item.itemID" @click="addItemToBag(item)">
										<div class="flex w-full cursor-pointer items-center gap-2 py-1 hover:bg-gray-100">
											<img
												:src="`/api/public/image/${item.imgName}`"
												class="border-final-border-soft ml-2 aspect-square w-8 rounded-lg border object-cover"
											/>
											{{ item.name }}
										</div>
										<USeparator />
									</div>
								</div>
							</template>
						</UPopover>
					</div>
				</template>
				<div class="flex flex-col gap-4">
					<EmergencyBagItemCard
						v-for="item in bagItems"
						:key="item.itemID"
						:name="item.name"
						:img-name="item.imgName"
						:item-deal="item.itemDeal"
						:item-id="item.itemID"
						:item-count="item.count"
						@increment="increaseItemCount(item.itemID)"
						@decrement="decreaseItemCount(item.itemID)"
						@remove="removeItemFromBag(item.itemID)"
					/>
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
const searchQuery = ref("")
const bagItems = defineModel<{
	itemID: string
	count: number
	name: string
	imgName: string
}>("bagItems")

const { data: itemData } = await useFetch("/api/student/inventory/items")

const filteredItems = computed(() => {
	const query = searchQuery.value.toLowerCase()
	return itemData.value.filter((item) => item.name.toLowerCase().startsWith(query))
})

const addItemToBag = (item: Item) => {
	if (!bagItems.value) return
	const existingItem = bagItems.value.find((bi) => bi.itemID === item.itemID)
	if (existingItem) {
		if (existingItem.count >= item.quantity) return
		existingItem.count++
	} else {
		bagItems.value.push({
			itemID: item.itemID,
			count: 1,
			name: item.name,
			imgName: item.imgName,
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
	if (item) {
		if (item.count >= inventoryItem.quantity) return
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
