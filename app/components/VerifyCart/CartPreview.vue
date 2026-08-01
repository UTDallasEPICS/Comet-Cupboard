<template>
	<UCard class="w-full">
		<template #header>
			<div v-if="validPublicCode" class="flex flex-row items-center justify-between">
				<UUser :name="cart.publicCode" :avatar="{ icon: cart.publicIcon }" size="lg" />

				<SharedButtonNavigateTo text="Back to carts" @click="emit('update:select-cart', '')" />
			</div>
			<SharedTextCardTitle v-else>Cart Preview</SharedTextCardTitle>
		</template>
		<div v-if="validPublicCode" class="flex h-full flex-col gap-y-4">
			<SharedWarningsList v-if="pendingCartWarnings(cart).length > 0" :warnings="pendingCartWarnings(cart)" />

			<SharedGroupedCollapsible :groups="categorizedCartItems" :get-key="(item) => item.itemID" :default-open="true">
				<template #header="{ group, open }">
					<div class="flex flex-col gap-2">
						<SharedButtonPositiveAction
							:text="group"
							:trailing-icon="icons['chevronDown']"
							block
							class="group w-full rounded-lg"
							:ui="{
								trailingIcon: open ? 'rotate-180 transition-transform duration-200' : 'transition-transform duration-200',
							}"
						/>
					</div>
				</template>

				<template #item="{ item: cartItem }">
					<ShoppingCartReviewItemCard
						:item-deal="
							cartItem.Item.Deal
								? {
										actualCount: cartItem.Item.Deal.actualCount,
										adjustedCount: cartItem.Item.Deal.adjustedCount,
									}
								: {}
						"
						class="w-full"
						:count="cartItem.count"
						:img-name="cartItem.Item.imgName"
						:item-i-d="cartItem.itemID"
						:name="cartItem.Item.name"
						:count-adjustment="cartItem.countAdjustment"
					/>
				</template>
			</SharedGroupedCollapsible>

			<div class="flex flex-col items-end">
				<SharedTextBase class="text-right text-nowrap">Total Count: {{ cartTotalCount }}</SharedTextBase>
				<SharedTextBase class="text-right text-nowrap">Adjusted Count: {{ cartAdjustedCount }}</SharedTextBase>
				<UTextarea v-model="reason" placeholder="Add a reason for declining or accepting the cart" class="w-full max-w-96" />
			</div>
			<div class="flex flex-row justify-center gap-x-4 sm:justify-end">
				<SharedButtonNegativeAction text="Decline" @click="rejectCart" />
				<SharedButtonPositiveAction text="Accept" @click="acceptCart" />
			</div>
		</div>
		<div v-else class="flex flex-col items-center justify-center gap-4">
			<SharedTextBase class="text-center">No carts currently selected</SharedTextBase>
			<!-- <img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" /> -->
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps({
	publicCode: {
		type: String,
		required: false,
		default: "",
	},
})

const emit = defineEmits(["update:select-cart", "cart-declined", "cart-accepted"])

const reason = ref("")

const validPublicCode = computed(() => {
	return props.publicCode !== ""
})

const { data: cart } = await useAsyncData(
	"pending-cart",
	async () => {
		if (props.publicCode === "") {
			return await Promise.resolve(null)
		}
		const response = await $fetch("/api/volunteer/verification/pendingCart", {
			query: { publicCode: props.publicCode },
		})
		return response
	},
	{
		immediate: false,
		watch: [() => props.publicCode],
	}
)

const categorizedCartItems = computed(() => {
	if (cart.value === null || "CartItems" in cart.value === false) {
		return {}
	}
	const items = cart.value?.CartItems.sort((a, b) => {
		const categoryCompare = a.Item.categoryName.localeCompare(b.Item.categoryName)
		if (categoryCompare !== 0) {
			return categoryCompare
		}

		return a.Item.name.localeCompare(b.Item.name)
	})

	return Object.groupBy(items, (cartItem) => cartItem.Item.categoryName)
})

const categoryCartItems = computed(() => {
	if (!cart || !cart.value || !cart.value.CartItems) {
		return {}
	}
	const categoryCartItemsGrouped = Object.groupBy(cart.value.CartItems, (cartItem) => {
		return cartItem.Item.categoryName
	})
	return categoryCartItemsGrouped
})

const cartAdjustedCount = computed(() => {
	let adjCount = 0
	Object.keys(categoryCartItems.value).forEach((category) => {
		adjCount += categoryCartItems.value[category]
			.map((cartItem) => {
				return cartItemCountAdjustment(cartItem).count
			})
			.reduce((a, b) => a + b, 0)
	})
	return adjCount
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

const rejectCart = async () => {
	await $fetch("/api/volunteer/verification/cartVerificationAction", {
		method: "POST",
		body: { publicCode: props.publicCode, action: "REJECT", reason: reason.value },
	})
	reason.value = ""
	emit("cart-declined", props.publicCode)
}

const acceptCart = async () => {
	await $fetch("/api/volunteer/verification/cartVerificationAction", {
		method: "POST",
		body: { publicCode: props.publicCode, action: "ACCEPT", reason: reason.value },
	})
	reason.value = ""
	emit("cart-accepted", props.publicCode)
}
</script>
