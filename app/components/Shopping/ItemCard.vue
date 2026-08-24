<template>
	<UChip
		:text="amountInCart"
		:show="amountInCart > 0"
		class="block w-full min-w-72"
		:ui="{
			base: 'h-6 min-w-6 text-xs',
		}"
	>
		<UCard
			class="relative w-full min-w-72 overflow-hidden shadow-md transition-colors"
			:class="{
				'border-utd-orange': amountInCart > 0,
			}"
			:ui="{
				body: 'p-0 sm:p-0',
			}"
		>
			<SharedDealBadge :item-deal="itemDeal" class="absolute top-2 right-2" />

			<div class="relative flex min-h-24 flex-row items-center gap-4 p-4">
				<img :src="`/api/public/image/${primaryImageName}`" :alt="name" class="border-border-soft h-16 w-16 shrink-0 rounded-lg border object-cover" />
				<div>
					<SharedTextCardTitle>{{ name }}</SharedTextCardTitle>
					<SharedTextBaseSecondary> {{ quantity }} available </SharedTextBaseSecondary>
				</div>

				<UButton
					v-if="orderedSpecificItems.length"
					color="neutral"
					variant="ghost"
					size="sm"
					class="absolute right-2 bottom-1"
					label="Show items"
					:trailing-icon="isSpecificItemsOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
					@click="isSpecificItemsOpen = !isSpecificItemsOpen"
				/>
			</div>

			<UCollapsible v-if="orderedSpecificItems.length" v-model:open="isSpecificItemsOpen">
				<template #content>
					<USeparator />
					<div class="space-y-2 px-4 py-2">
						<div v-for="specificItem in orderedSpecificItems" :key="specificItem.specificItemID">
							<div class="flex w-full flex-row items-center gap-4">
								<img
									:src="`/api/public/image/${specificItem.imgName}`"
									:alt="`${name} (${specificItem.productName})`"
									class="border-border-soft h-12 w-12 shrink-0 rounded-md border object-cover"
								/>
								<div>
									<SharedTextBaseSecondary>{{ specificItem.productName }}</SharedTextBaseSecondary>
									<SharedTextBaseSecondary>
										{{ specificItem.quantity }} available
										{{
											specificItemAmountInCart(specificItem.specificItemID) > 0
												? `(${specificItemAmountInCart(specificItem.specificItemID)} in cart)`
												: ""
										}}
									</SharedTextBaseSecondary>
									<div class="flex flex-row gap-2">
										<UBadge
											v-for="label in specificItem.itemLabels"
											:key="label.itemLabelName"
											:label="label.itemLabelName"
											color="neutral"
											variant="subtle"
											size="md"
										/>
									</div>
								</div>
								<SharedButtonPositiveAction
									text="Add"
									class="ml-auto"
									color="secondary"
									@click="addSpecificItemToCart(specificItem.specificItemID)"
								/>
							</div>
						</div>
					</div>
				</template>
			</UCollapsible>
		</UCard>
	</UChip>
</template>

<script lang="ts" setup>
const cartStore = useCartStore()

const props = defineProps({
	name: {
		type: String,
		required: true,
	},

	itemID: {
		type: String,
		required: true,
	},

	itemDeal: {
		type: Object,
		default: () => ({}),
	},

	quantity: {
		type: Number,
		default: 0,
	},

	specificItems: {
		type: Array,
		default: () => [],
	},
})

const isSpecificItemsOpen = ref(false)

const normalizedSpecificItems = computed(() => (Array.isArray(props.specificItems) ? props.specificItems : []) as Array<Record<string, any>>)

const orderedSpecificItems = computed(() =>
	[...normalizedSpecificItems.value].sort((first, second) => Number(second.productName === "Default") - Number(first.productName === "Default"))
)

const primaryImageName = computed(() => orderedSpecificItems.value[0]?.imgName ?? "")

const amountInCart = computed(() =>
	normalizedSpecificItems.value.reduce((sum, specificItem) => {
		const cartItem = cartStore.itemIDtoCartItemMap[specificItem.specificItemID]

		return sum + (cartItem ? cartItem.count : 0)
	}, 0)
)

const specificItemAmountInCart = (specificItemID: string) => {
	const cartItem = cartStore.itemIDtoCartItemMap[specificItemID]
	return cartItem ? cartItem.count : 0
}

const addSpecificItemToCart = async (specificItemID: string) => {
	try {
		await $fetch("/api/student/cart/cartItemCount", {
			method: "POST",
			body: {
				specificItemID,
				incrementChange: 1,
			},
		})

		await cartStore.getCart()
	} catch {
		cartStore.cartView = true
	}
}
</script>
