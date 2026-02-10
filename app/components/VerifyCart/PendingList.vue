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

const pendingCartUpdates = ref<EventSource>()
const pendingCartsList = ref(pendingCarts.value)
const config = useRuntimeConfig()

const pendingCartIDsAndAdjQTY = computed(() => {
	if (!pendingCartsList.value) {
		return []
	}
	return pendingCartsList.value.map((pendingCart) => {
		return { cartID: pendingCart.cartID, adjQTY: cartCountAdjustment(pendingCart) }
	})
})

if (import.meta.client) {
	// change this to use env later
	// also probably use zod to type check the message...
	pendingCartUpdates.value = new EventSource(`${config.public.LOCAL_URL}api/verification/pendingCartsUpdate`)
	pendingCartUpdates.value.onmessage = (event) => {
		const { type, payload } = JSON.parse(event.data)
		if (type === "NEW CART") {
			const newCart = payload
			pendingCartsList.value.push(newCart)
		} else if (type === "ACCEPT CART" || type === "REJECT CART" || type === "RETRACT CART") {
			const cartIDToRemove = payload.cartID
			pendingCartsList.value = pendingCartsList.value.filter((pendingCart) => {
				return pendingCart.cartID != cartIDToRemove
			})
		}
	}
}

onBeforeUnmount(() => {
	if (pendingCartUpdates.value) {
		pendingCartUpdates.value.close()
	}
})
</script>
