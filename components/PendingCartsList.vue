<template lang="pug">
div.border-black.border-4
	div.border-black.border-b-4
		p search
	div.border-black
		p.cursor-pointer(v-for="pendingCartID in pendingCartIDs" @click="$emit('update:select-cart', pendingCartID)") {{ pendingCartID }}
</template>

<script lang="ts" setup>
const pendingCartIDs = ref<Array<string>>([])
const pendingCartUpdates = ref<EventSource>()

onMounted(async () => {
	await getPendingCarts()
})

const getPendingCarts = async () => {
	const pendingCarts = await $fetch("/api/verification/pendingCarts", { method: "GET" })
	pendingCartIDs.value = pendingCarts.map((pendingCart) => {
		return pendingCart.cartID
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
			pendingCartIDs.value.push(cartIDToAdd)
		}
		else if (type === "ACCEPT CART" || type === "REJECT CART") {
			const cartIDToRemove = payload.cartID
			pendingCartIDs.value = pendingCartIDs.value.filter((cartID) => {
				return cartID != cartIDToRemove
			})
		}
	}
}
</script>
