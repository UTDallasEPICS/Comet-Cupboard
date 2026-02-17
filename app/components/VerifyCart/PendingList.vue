<template>
	<UCard class="min-w-72">
		<template #header>
			<p>Pending Carts</p>
		</template>
		<div>
			<div v-if="pendingCartIDsAndAdjQTY.length === 0" class="flex grow flex-row items-center justify-center">
				<p class="text-center text-black">There are no carts</p>
			</div>
			<div v-else class="flex flex-col gap-4">
				<UButton
					v-for="pendingCart in pendingCartIDsAndAdjQTY"
					:key="pendingCart.cartID"
					variant="outline"
					class="h-12 justify-between"
					@click="emit('update:select-cart', pendingCart.cartID)"
				>
					<p>{{ pendingCart.cartID }}</p>
				</UButton>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps({
	selectedCart: {
		type: String,
		required: true,
	},
})

const emit = defineEmits(["update:select-cart"])

const { data: pendingCarts } = await useFetch("/api/verification/pendingCarts")

const pendingCartsList = ref(pendingCarts.value)

const pendingCartIDsAndAdjQTY = computed(() => {
	if (!pendingCartsList.value) {
		return []
	}
	return pendingCartsList.value.map((pendingCart) => {
		return { cartID: pendingCart.cartID, adjQTY: cartCountAdjustment(pendingCart) }
	})
})

const { onEvent } = useVolunteerEventStream()

const unsubscribe = onEvent((event) => {
	switch (event.type) {
		case "verifyCartList.cart.added": {
			const { cart } = event.payload
			pendingCartsList.value.push(cart)
			break
		}
		case "verifyCartList.cart.removed": {
			const cartIDToRemove = event.payload.cartID
			pendingCartsList.value = pendingCartsList.value.filter((pendingCart) => {
				return pendingCart.cartID != cartIDToRemove
			})
			break
		}
	}
})

onBeforeUnmount(() => {
	unsubscribe()
})
</script>
