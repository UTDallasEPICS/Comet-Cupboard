<template>
	<UCard class="w-full">
		<template #header>
			<div v-if="validPublicCode" class="flex flex-row items-center justify-between">
				<UUser :name="cart.publicCode" :avatar="{ icon: cart.publicIcon }" size="lg" />

				<UButton @click="emit('update:select-cart', '')"> Back to carts </UButton>
			</div>
			<SharedTextCardTitle v-else>Cart Preview</SharedTextCardTitle>
		</template>
		<div v-if="validPublicCode" class="flex h-full flex-col gap-y-4">
			<SharedWarningsList v-if="pendingCartWarnings(cart).length > 0" :warnings="pendingCartWarnings(cart)" />
			<div class="grid justify-items-center gap-4" :style="{ gridTemplateColumns: 'repeat(auto-fill, minmax(288px, 1fr))' }">
				<UCollapsible v-for="category in Object.keys(categoryCartItems)" :key="category" class="w-full" :default-open="true">
					<UButton
						:label="category"
						color="primary"
						variant="ghost"
						:trailing-icon="icons['chevronDown']"
						block
						class="group"
						:ui="{
							trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
						}"
					/>
					<USeparator type="solid" size="sm" color="primary" />

					<template #content>
						<div class="m-1 grid place-items-center gap-4" style="grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))">
							<ShoppingCartReviewItemCard
								v-for="cartItem in categoryCartItems[category]"
								:key="cartItem.itemID"
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
						</div>
					</template>
				</UCollapsible>
			</div>
			<div class="flex flex-col items-end">
				<p class="text-right text-nowrap">Total Count: {{ cartTotalCount }}</p>
				<p class="text-right text-nowrap">Adjusted Count: {{ cartAdjustedCount }}</p>
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
		console.log("response", response)
		return response
	},
	{
		immediate: false,
		watch: [() => props.publicCode],
	}
)

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
