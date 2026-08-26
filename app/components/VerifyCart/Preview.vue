<template>
	<SharedLayoutSectionUCard :title="validPublicCode ? publicCode : 'Cart Preview'" class="w-full">
		<template #header>
			<SharedButtonActionButton
				v-if="validPublicCode"
				action="navigate-to"
				text="Back to carts"
				leading-icon="i-lucide-arrow-left"
				@click="emit('update:select-cart', '')"
			/>
		</template>
		<div v-if="validPublicCode && cart" class="flex h-full flex-col gap-y-4">
			<SharedWarningsList v-if="pendingCartWarnings(cart).length > 0" :warnings="pendingCartWarnings(cart)" />

			<SharedLayoutGroupedCollapsible :groups="categorizedCartItems" :get-key="(item) => item.itemID" :default-open="true">
				<template #header="{ group, open }">
					<div class="flex flex-col gap-2">
						<SharedButtonActionButton
							action="positive"
							:text="group"
							trailing-icon="i-lucide-chevron-down"
							block
							class="group w-full rounded-lg"
							:ui="{ trailingIcon: open ? 'rotate-180 transition-transform duration-200' : 'transition-transform duration-200' }"
						/>
					</div>
				</template>

				<template #item="{ item }">
					<DomainCardShoppingCartReviewItemCard
						class="w-full"
						:item-deal="item.itemDeal"
						:name="item.name"
						:specific-items="item.specificItems"
						:item-final-count="itemFinalCounts[item.itemID] ?? 0"
					/>
				</template>
			</SharedLayoutGroupedCollapsible>

			<div class="flex flex-col items-end">
				<SharedTextBase class="text-right text-nowrap">Total Count: {{ cartTotalCount }}</SharedTextBase>
				<SharedTextBase class="text-right text-nowrap">Adjusted Count: {{ cartAdjustedCount }}</SharedTextBase>
				<UTextarea v-model="reason" placeholder="Add a reason for declining or accepting the cart" class="w-full max-w-96" />
			</div>
			<div class="flex flex-row justify-center gap-x-4 sm:justify-end">
				<SharedButtonActionButton action="negative" text="Decline" @click="emit('cart-declined', publicCode, reason)" />
				<SharedButtonActionButton action="positive" text="Accept" leading-icon="i-lucide-check" @click="emit('cart-accepted', publicCode, reason)" />
			</div>
		</div>
		<SharedTextBase v-else class="block text-center"> {{ validPublicCode ? "Loading cart..." : "No carts currently selected" }} </SharedTextBase>
	</SharedLayoutSectionUCard>
</template>

<script lang="ts" setup>
import type { PropType } from "vue"

const props = defineProps({
	publicCode: {
		type: String,
		required: false,
		default: "",
	},
	cart: {
		type: Object as PropType<any | null>,
		default: null,
	},
})

const emit = defineEmits<{
	"update:select-cart": [publicCode: string]
	"cart-declined": [publicCode: string, reason: string]
	"cart-accepted": [publicCode: string, reason: string]
}>()

const reason = ref("")

const validPublicCode = computed(() => {
	return props.publicCode !== ""
})

const cart = toRef(props, "cart")

const categorizedCartItems = computed<Record<string, any[]>>(() => {
	if (cart.value === null || "cartItems" in cart.value === false) {
		return {}
	}
	const items = [...cart.value.cartItems].sort((a, b) => {
		const categoryCompare = a.specificItem.item.category.categoryName.localeCompare(b.specificItem.item.category.categoryName)
		if (categoryCompare !== 0) {
			return categoryCompare
		}

		return a.specificItem.item.itemName.localeCompare(b.specificItem.item.itemName)
	})

	const categoryGroups = Object.groupBy(items, (cartItem) => cartItem.specificItem.item.category.categoryName) as Record<string, any[]>
	return Object.fromEntries(
		Object.entries(categoryGroups).map(([categoryName, categoryCartItems]) => {
			const itemGroups = Object.groupBy(categoryCartItems, (cartItem) => cartItem.specificItem.itemID) as Record<string, any[]>
			return [
				categoryName,
				Object.entries(itemGroups).map(([itemID, itemCartItems]) => {
					const cartItems = itemCartItems as any[]
					const firstCartItem = cartItems[0]
					return {
						itemID,
						name: firstCartItem.specificItem.item.itemName,
						itemDeal: firstCartItem.specificItem.item.deal ?? {},
						specificItems: cartItems.map((cartItem) => ({
							specificItemID: cartItem.specificItemID,
							productName: cartItem.specificItem.productName,
							imgName: cartItem.specificItem.imgName,
							count: cartItem.count,
							countAdjustment: cartItem.countAdjustment,
						})),
					}
				}),
			]
		})
	)
})

const categoryCartItems = computed(() => {
	if (!cart || !cart.value || !cart.value.cartItems) {
		return {}
	}
	const categoryCartItemsGrouped = Object.groupBy(cart.value.cartItems, (cartItem) => {
		return cartItem.specificItem.item.category.categoryName
	})
	return categoryCartItemsGrouped as Record<string, any[]>
})

const itemFinalCounts = computed(() => cartItemFinalCounts(cart.value))

const cartAdjustedCount = computed(() => {
	return cartCountAdjustment(cart.value)
})

const cartTotalCount = computed(() => {
	if (isEmptyObject(categoryCartItems.value)) {
		return 0
	}
	let totCount = 0
	Object.keys(categoryCartItems.value).forEach((category) => {
		totCount += categoryCartItems.value[category]
			.map((cartItem) => {
				return cartItem.count
			})
			.reduce((a, b) => a + b, 0)
	})
	return totCount
})
</script>


