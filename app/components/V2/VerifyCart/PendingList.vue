<template lang="pug">
div.flex.flex-col.gap-y-4.min-w-72.min-h-12
	div(v-if="pendingCartIDsAndAdjQTY.length === 0").flex.flex-row.grow.justify-center.items-center
		p.p-1.text-center.text-xl.text-black.font-semibold There are no carts
	div(v-else).flex.flex-col.gap-4
		button(
			v-for="pendingCart in pendingCartIDsAndAdjQTY"
			@click="emit('update:select-cart', pendingCart.cartID)"
		).w-72.h-12.rounded-lg.border.border-outlining-gray-v2.bg-white.border
			div.flex.justify-center.items-center
				p.p-1.text-xl.text-center.font-semibold {{ pendingCart.cartID }}
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
