<template>
	<div class="flex justify-center">
		<div class="flex w-full max-w-100 flex-col">
			<SharedFormCard>
				<div class="flex flex-row items-center justify-between gap-4">
					<SharedTextCardTitle>Current Bag</SharedTextCardTitle>
					<div class="relative w-42">
						<UPopover v-model:open="open" :dismissible="false" :ui="{ content: 'w-(--reka-popper-anchor-width) ' }">
							<template #anchor>
								<UInput
									v-model="searchQuery"
									icon="i-lucide-search"
									variant="outline"
									class="w-full"
									placeholder="Search..."
									@focus="open = true"
								/>
							</template>

							<template #content>
								<div class="absolute right-0 max-h-64 w-64 overflow-y-auto rounded-lg border border-gray-400 bg-white">
									<div v-for="item in filteredItems" :key="item.specificItemID" @click="addItemToBag(item)">
										<div class="flex items-center justify-between hover:bg-gray-100">
											<div class="flex w-full cursor-pointer items-center gap-2 py-1">
												<img :src="`/api/public/image/${item.imgName}`" :alt="item.name" class="ml-2 aspect-square w-8 rounded-lg" />
												<div class="flex min-w-0 flex-col">
													<SharedTextBase class="truncate">{{ item.name }}</SharedTextBase>
													<SharedTextBaseSecondary>{{ item.productName }}</SharedTextBaseSecondary>
												</div>
											</div>
											<div class="mr-2 flex">
												<SharedTextBaseSecondary>Qty:</SharedTextBaseSecondary>
												{{ item.quantity }}
											</div>
										</div>
										<div v-if="item.itemLabels.length" class="ml-12 flex flex-wrap gap-1 pb-1">
											<UBadge v-for="label in item.itemLabels" :key="label" :label="label" color="neutral" variant="outline" />
										</div>
										<USeparator />
									</div>
								</div>
							</template>
						</UPopover>
					</div>
				</div>

				<USeparator class="mt-2 mb-4" />

				<div class="flex flex-col gap-4">
					<div v-if="bagItems.length === 0" class="flex flex-col items-center justify-center gap-y-4">
						<SharedTextBase> No items in current bag </SharedTextBase>
						<img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" />
					</div>
					<DomainCardEmergencyBagItemCard
						v-for="item in bagItems"
						:key="item.specificItemID"
						:name="item.name"
						:product-name="item.productName"
						:img-name="item.imgName"
						:item-id="item.specificItemID"
						:item-count="item.count"
						:item-quantity="item.quantity"
						:item-labels="item.itemLabels"
						@increment="increaseItemCount(item.specificItemID)"
						@decrement="decreaseItemCount(item.specificItemID)"
						@remove="removeItemFromBag(item.specificItemID)"
					/>
				</div>
				<div class="flex justify-center">
					<SharedTextBaseSecondary v-if="hasError" class="mt-4 text-sm text-red-500"
						>Please add at least one item to your bag</SharedTextBaseSecondary
					>
				</div>
			</SharedFormCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
const searchQuery = ref("")
const open = ref(false)
type BagItem = {
	specificItemID: string
	count: number
	name: string
	productName: string
	imgName: string
	quantity: number
	itemLabels: string[]
}

const bagItems = defineModel<BagItem[]>("bagItems", { required: true })
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

const specificItemOptions = computed(() => {
	if (!itemData.value) return []
	return itemData.value.flatMap((item: any) =>
		item.specificItems.map((specificItem: any) => ({
			specificItemID: specificItem.specificItemID,
			name: item.itemName,
			productName: specificItem.productName,
			imgName: specificItem.imgName,
			quantity: Number(specificItem.quantity),
			itemLabels: specificItem.itemLabels.map((label: any) => label.itemLabelName),
		}))
	)
})

const filteredItems = computed(() => {
	const query = searchQuery.value.toLowerCase()
	return specificItemOptions.value.filter((item: BagItem) =>
		[item.name, item.productName, ...item.itemLabels].some((value) => value.toLowerCase().includes(query))
	)
})

const addItemToBag = (item: { specificItemID: string; name: string; productName: string; imgName: string; quantity: number; itemLabels: string[] }) => {
	if (!bagItems.value) return
	const available = Math.max(0, item.quantity)
	if (available === 0) return
	const existingItem = bagItems.value.find((bagItem) => bagItem.specificItemID === item.specificItemID)
	if (existingItem) {
		if (existingItem.count >= available) return
		existingItem.count++
	} else {
		bagItems.value.push({
			specificItemID: item.specificItemID,
			count: 1,
			name: item.name,
			productName: item.productName,
			imgName: item.imgName,
			quantity: available,
			itemLabels: item.itemLabels,
		})
	}
}

const removeItemFromBag = (specificItemID: string) => {
	if (!bagItems.value) return
	bagItems.value = bagItems.value.filter((bagItem) => bagItem.specificItemID !== specificItemID)
}

const increaseItemCount = (specificItemID: string) => {
	if (!bagItems.value) return
	const item = bagItems.value.find((bagItem) => bagItem.specificItemID === specificItemID)
	const inventoryItem = specificItemOptions.value.find((specificItem: BagItem) => specificItem.specificItemID === specificItemID)
	if (item && inventoryItem) {
		const available = Math.max(0, inventoryItem.quantity)
		if (item.count >= available) return
		item.count++
	}
}

const decreaseItemCount = (specificItemID: string) => {
	if (!bagItems.value) return
	const item = bagItems.value.find((bagItem) => bagItem.specificItemID === specificItemID)
	if (item) {
		if (item.count === 1) {
			return
		} else {
			item.count--
		}
	}
}
</script>
