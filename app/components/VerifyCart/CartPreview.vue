<template>
	<UCard class="w-full">
		<template #header>
			<p v-if="validCartID">{{ cartID }}</p>
			<p v-else>Cart Preview</p>
		</template>
		<div v-if="validCartID" class="flex h-full flex-col gap-y-4">
			<div class="flex flex-col items-center gap-x-4 gap-y-4">
				<SharedBannerWarning v-for="(warning, index) in warnings" :key="index" :text="warning" class="w-full" />
			</div>
			<UCheckbox v-model="showDetailed" label="Show Detailed View" />
			<div class="grid justify-items-center gap-4" :style="{ gridTemplateColumns: 'repeat(auto-fill, minmax(288px, 1fr))' }">
				<UCollapsible v-for="category in Object.keys(categoryCartItems)" :key="category" class="w-full" :default-open="true">
					<UButton
						:label="category"
						color="primary"
						variant="solid"
						:trailing-icon="icons['chevronDown']"
						block
						class="group"
						:ui="{
							trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
						}"
					/>
					<template #content>
						<div class="mt-1 grid place-items-center gap-4" style="grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))">
							<VerifyCartItemCard
								v-for="cartItem in categoryCartItems[category]"
								:key="cartItem.itemID"
								:adjusted-q-t-y="cartItem.adjustedQTY"
								:deal-count="cartItem.dealCount"
								:expired-count="cartItem.expiredCount"
								:img-name="cartItem.imgName"
								:item-deal="
									cartItem.itemDeal ? { actualCount: cartItem.itemDeal.actualCount, adjustedCount: cartItem.itemDeal.adjustedCount } : {}
								"
								:item-i-d="cartItem.itemID"
								:name="cartItem.name"
								:total-q-t-y="cartItem.totalQTY"
								:detailed="showDetailed"
							/>
						</div>
					</template>
				</UCollapsible>
			</div>
			<div class="flex flex-col items-end">
				<p class="text-right text-nowrap">Total Count {{ cartTotalCount }}</p>
				<p class="text-right text-nowrap">Adjusted Count {{ cartAdjustedCount }}</p>
				<UTextarea v-model="reason" placeholder="Add a reason for declining or accepting the cart" class="w-full max-w-96" />
			</div>
			<div class="flex flex-row justify-center gap-x-4 sm:justify-end">
				<SharedButtonNegativeAction text="Decline" @click="rejectCart" />
				<SharedButtonPositiveAction text="Accept" @click="acceptCart" />
			</div>
		</div>
		<div v-else class="flex h-48 items-center justify-center">
			<p class="text-center">There are no carts currently selected</p>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps({
	cartID: {
		type: String,
		required: false,
		default: "",
	},
})

const emit = defineEmits(["cart-declined", "cart-accepted"])

const reason = ref("")
const showDetailed = ref(true)

const validCartID = computed(() => {
	return props.cartID !== ""
})

const { data: cart } = await useAsyncData(
	"pending-cart",
	async () => {
		if (props.cartID === "") {
			return await Promise.resolve(null)
		}
		return $fetch("/api/volunteer/verification/pendingCart", {
			query: { cartID: props.cartID },
		})
	},
	{
		immediate: false,
		watch: [() => props.cartID],
	}
)

const warnings: Array<string> = computed(() => {
	if (!cart || !cart.value) {
		return []
	}
	return pendingCartWarnings(cart.value)
})

const categoryCartItems = computed<
	Record<
		string,
		Array<{ name: string; imgName: string; itemID: number; itemDeal: any; totalQTY: number; dealCount: number; expiredCount: number; adjustedQTY: number }>
	>
>(() => {
	if (!cart || !cart.value || !cart.value.CartItems) {
		return {}
	}
	const categoryCartItemsGrouped = Object.groupBy(cart.value.CartItems, (cartItem) => {
		return cartItem.Item.categoryName
	})
	Object.keys(categoryCartItemsGrouped).forEach((category) => {
		categoryCartItemsGrouped[category] = categoryCartItemsGrouped[category].map((cartItem) => {
			const { count: adjustedCount, dealCount } = cartItemCountAdjustment(cartItem)
			return {
				name: cartItem.Item.name,
				imgName: cartItem.Item.imgName,
				itemID: cartItem.itemID,
				itemDeal: cartItem.Item.Deal,
				totalQTY: cartItem.count,
				dealCount: dealCount,
				expiredCount: cartItem.expiredCount,
				adjustedQTY: adjustedCount,
			}
		})
	})
	return categoryCartItemsGrouped
})

const cartAdjustedCount = computed(() => {
	let adjCount = 0
	Object.keys(categoryCartItems.value).forEach((category) => {
		adjCount += categoryCartItems.value[category]
			.map((cartItem) => {
				return cartItem.adjustedQTY
			})
			.reduce((a, b) => a + b, 0)
	})
	return adjCount
})

const cartTotalCount = computed(() => {
	let totCount = 0
	Object.keys(categoryCartItems.value).forEach((category) => {
		totCount += categoryCartItems.value[category]
			.map((cartItem) => {
				return cartItem.totalQTY
			})
			.reduce((a, b) => a + b, 0)
	})
	return totCount
})

const rejectCart = async () => {
	await $fetch("/api/volunteer/verification/cartVerificationAction", {
		method: "POST",
		body: { cartID: props.cartID, action: "REJECT", reason: reason.value },
	})
	reason.value = ""
	emit("cart-declined", props.cartID)
}

const acceptCart = async () => {
	await $fetch("/api/volunteer/verification/cartVerificationAction", {
		method: "POST",
		body: { cartID: props.cartID, action: "ACCEPT", reason: reason.value },
	})
	reason.value = ""
	emit("cart-accepted", props.cartID)
}
</script>
