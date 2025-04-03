<template lang="pug">
div.flex.flex-col.gap-y-4.min-w-60
	div(v-if="pendingCartIDsAndAdjQTY.length === 0").flex.flex-row.p-1.text-center.text-xl.text-gray-500.justify-center
		p No Pending Carts
	div(v-else)
		button(
			v-for="pendingCart in pendingCartIDsAndAdjQTY"
			:class="pendingCart.cartID === selectedCart ? 'bg-utd-orange text-white' : 'bg-cupboard-lg'"
			@click="emit('update:select-cart', pendingCart.cartID)"
		).h-12.rounded-xl.hover_bg-utd-orange.hover_text-white
			div.flex.flex-row.justify-between
				span.px-4.text-xl.text-left.font-normal {{ pendingCart.cartID }}
				span.px-4.text-xl.text-right.font-normal QTY: {{ pendingCart.adjQTY }}
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
const pendingCartsList = ref(pendingCarts)

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
	pendingCartUpdates.value = new EventSource("http://localhost:3000/api/verification/pendingCartsUpdate")
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
</script>
