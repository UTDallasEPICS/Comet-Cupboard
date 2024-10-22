<template lang="pug">
div.flex.flex-col.gap-y-4.min-w-60
	button.h-12.rounded-xl.drop-shadow-standard.cursor-pointer.hover_bg-utd-orange.hover_text-white(
		:class="((pendingCart.cartID === selectedCart) ? ('bg-utd-orange text-white') : 'bg-cupboard-lg')" @click="emit('update:select-cart', pendingCart.cartID)" v-for="pendingCart in pendingCartIDsAndAdjQTY") 
		div.flex.flex-row.justify-between
			span.px-4.text-xl.text-left {{ pendingCart.cartID }}
			span.px-4.text-xl.text-right QTY: {{ pendingCart.adjQTY }}
</template>

<script lang="ts" setup>
const props = defineProps({
	selectedCart: {
		type: String,
		required: true,
	},
})

const emit = defineEmits(["update:select-cart"])

const pendingCartIDsAndAdjQTY = ref<Array<{ cartID: string; adjQTY: number }>>([])
const pendingCartUpdates = ref<EventSource>()

onMounted(async () => {
	await getPendingCarts()
})

const getPendingCarts = async () => {
	const pendingCarts = await $fetch("/api/verification/pendingCarts", { method: "GET" })
	pendingCartIDsAndAdjQTY.value = pendingCarts.map((pendingCart) => {
		return { cartID: pendingCart.cartID, adjQTY: cartCountAdjustment(pendingCart) }
	})
}

if (import.meta.client) {
	// change this to use env later
	// also probably use zod to type check the message...
	pendingCartUpdates.value = new EventSource("http://localhost:3000/api/verification/pendingCartsUpdate")
	pendingCartUpdates.value.onmessage = (event) => {
		const { type, payload } = JSON.parse(event.data)
		if (type === "NEW CART") {
			const cartIDToAdd = payload.cartID
			const adjQTY = cartCountAdjustment(payload)
			pendingCartIDsAndAdjQTY.value.push({ cartID: cartIDToAdd, adjQTY: adjQTY })
		} else if (type === "ACCEPT CART" || type === "REJECT CART") {
			const cartIDToRemove = payload.cartID
			pendingCartIDsAndAdjQTY.value = pendingCartIDsAndAdjQTY.value.filter((idsAndAdjQTY) => {
				return idsAndAdjQTY.cartID != cartIDToRemove
			})
		}
	}
}
</script>
