<template>
	<UChip
		:text="changeCount > 0 ? `+${changeCount}` : `${changeCount}`"
		:show="changeCount != 0"
		:ui="{
			base: 'h-[24px] min-w-[24px] text-[12px]',
		}"
		class="w-full"
	>
		<UCard :class="`${changeCount != 0 ? 'border-utd-orange' : ''} relative w-full min-w-72 overflow-hidden shadow-md`" :ui="{ body: 'p-0 sm:p-0' }">
			<div class="absolute top-2 right-2 z-10 flex flex-row items-center gap-2">
				<SharedDealBadge :item-deal="itemDeal" />
				<SharedButtonActionButton
					:to="`/volunteer/inventory/${category}/${itemID}/edit`"
					icon="i-lucide-edit"
					size="sm"
					action="neutral"
					button-variant="ghost"
				/>
			</div>

			<div class="relative flex min-h-24 items-center gap-4 p-4">
				<img :src="`/api/public/image/${primaryImageName}`" :alt="name" class="border-border-soft h-16 w-16 shrink-0 rounded-lg border object-cover" />
				<div>
					<SharedTextCardTitle>{{ name }}</SharedTextCardTitle>
					<SharedTextBaseSecondary>{{ currentCount }} in stock</SharedTextBaseSecondary>
				</div>
				<SharedButtonActionButton
					:trailing-icon="isOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
					size="sm"
					button-variant="ghost"
					action="neutral"
					class="absolute right-2 bottom-1"
					text="Restock item"
					@click="isOpen = !isOpen"
				/>
			</div>
			<UCollapsible v-model:open="isOpen">
				<template #content>
					<USeparator />
					<SharedTextBaseSecondary class="mt-2 text-center">Select a specific item to restock</SharedTextBaseSecondary>

					<div v-if="normalizedSpecificItems.length" class="border-border-soft">
						<div class="space-y-2 p-2">
							<SharedButtonActionButton
								v-for="product in orderedSpecificItems"
								:key="product.specificItemID"
								action="neutral"
								button-variant="ghost"
								class="border-border-soft w-full border"
								:class="{ 'border-secondary bg-secondary/10': restockSpecificItemID === product.specificItemID }"
								@click="restockSpecificItemID = product.specificItemID"
							>
								<div class="flex w-full flex-row items-center gap-4">
									<img
										:src="`/api/public/image/${product.imgName}`"
										:alt="`${name} (${product.productName})`"
										class="border-border-soft h-12 w-12 shrink-0 rounded-md border object-cover"
									/>
									<div class="text-left">
										<SharedTextBaseSecondary
											>{{ product.productName }}
											{{ restockSpecificItemID === product.specificItemID ? "(Selected)" : "" }}</SharedTextBaseSecondary
										>
										<SharedTextBaseSecondary>
											{{ product.quantity }} in stock
											{{
												specificItemTotalInventoryIntakeSessionChange(product.specificItemID) !== 0
													? `(${specificItemTotalInventoryIntakeSessionChange(product.specificItemID)} to restock)`
													: ""
											}}
										</SharedTextBaseSecondary>
										<div class="flex flex-row gap-2">
											<UBadge
												v-for="label in product.itemLabels"
												:key="label.itemLabelName"
												:label="label.itemLabelName"
												color="neutral"
												variant="subtle"
												size="md"
											/>
										</div>
									</div>
								</div>
							</SharedButtonActionButton>
						</div>
						<form class="p-2" @submit.prevent="confirmRestock">
							<USeparator class="mb-4" />
							<div class="flex flex-wrap items-center justify-end gap-2">
								<USelect v-model="restockDirection" :items="['+', '-']" class="w-16" aria-label="Change direction" />
								<UInput v-model.number="restockAmount" type="number" min="1" step="1" class="w-16" aria-label="Change amount" />
								<SharedButtonActionButton
									type="submit"
									:loading="isSaving"
									:disabled="isSaving || !restockSpecificItemID"
									text="Confirm"
									leading-icon="i-lucide-check"
									action="positive"
								/>
							</div>
						</form>
					</div>
				</template>
			</UCollapsible>
		</UCard>
	</UChip>
</template>

<script lang="ts" setup>
type SpecificItem = {
	specificItemID: string
	productName: string
	imgName: string
	quantity: number
	itemLabels: { itemLabelName: string }[]
}

const props = defineProps({
	name: {
		type: String,
		default: "Item name",
	},
	imgName: {
		type: String,
		default: "",
	},
	itemDeal: {
		type: Object,
		default: () => ({}),
	},
	itemID: {
		type: String,
		required: true,
	},
	currentCount: {
		type: Number,
		default: 0,
	},
	changeCount: {
		type: Number,
		default: 0,
	},
	category: {
		type: String,
		required: true,
	},
	specificItems: {
		type: Array,
		default: () => [],
	},
})

const inventoryStore = useInventoryStore()

const isOpen = ref(false)

const restockDirection = ref("+")
const restockAmount = ref(1)
const normalizedSpecificItems = computed(() => (Array.isArray(props.specificItems) ? props.specificItems : []) as SpecificItem[])
const orderedSpecificItems = computed(() =>
	[...normalizedSpecificItems.value].sort((first, second) => Number(second.productName === "Default") - Number(first.productName === "Default"))
)

const specificItemTotalInventoryIntakeSessionChange = (specificItemID: string) => {
	return inventoryStore.inventoryChangesItems
		.filter((change) => change.specificItemID === specificItemID)
		.reduce((sum, change) => sum + change.amountChanged, 0)
}

const primaryImageName = computed(() => orderedSpecificItems.value[0]?.imgName ?? "")
const restockSpecificItemID = ref<string | undefined>(normalizedSpecificItems.value[0]?.specificItemID)
const isSaving = ref(false)

const confirmRestock = async () => {
	if (!restockSpecificItemID.value || !Number.isInteger(restockAmount.value) || restockAmount.value < 1) return
	await inventoryStore.changeInventorySessionItemCount(
		restockSpecificItemID.value,
		restockDirection.value === "+" ? restockAmount.value : -restockAmount.value
	)
	if (inventoryStore.selectedIntakeSessionID) isOpen.value = false
}
</script>
