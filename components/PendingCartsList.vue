<template lang="pug">
div.flex.flex-col.gap-y-4.w-72
	button.h-12.rounded-xl.drop-shadow.cursor-pointer.hover_bg-utd-orange.hover_text-white(
		:class="(s === selectedCart ? ('bg-utd-orange text-white') : 'bg-cupboard-lg')" v-for="s in tempArr" @click="selectCart(s)") 
		div.flex.flex-row.justify-between
			span.px-4.text-xl.text-left {{s}}
			span.px-4.text-xl.text-right QTY: 2
</template>

<script lang="ts" setup>
const tempArr = ref<Array<string>>(["abc123456", "def123456", "ghi123456", "jkl123456", "mno123456", "pqr123456", "stu123456", "vwx123456"])
const emit = defineEmits(["update:select-cart"])

const pendingCartIDs = ref<Array<string>>([])
const selectedCart = ref<string>("")
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

const selectCart = (cartID: string) => {
	selectedCart.value = cartID
	emit("update:select-cart", cartID)
}
</script>
