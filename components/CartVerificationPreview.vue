<template lang="pug">
div.border-black.border-4.flex.flex-col.flex-nowrap.h-fit
	div.border-black.border-b-4
		p {{ cartID }}
	div.border-black.border-b-4.grid.gap-4.p-4(class="grid-cols-1 lg:grid-cols-2")
		CartItemVerifyCard(v-for="cartItem in cartItems" 
            :name="cartItem.name" :imgURL="cartItem.imgURL" :itemID="cartItem.itemID" :count="cartItem.count")
	div.flex.flex-row
		p reason
		ActionButton.block.w-72.h-min(class="sm:flex-grow-0" style="background-color: #FF0000" @click="rejectCart")
			p Reject
		ActionButton.block.w-72.h-min(class="sm:flex-grow-0" @click="acceptCart")
			p Accept
</template>

<script lang="ts" setup>
console.log("set up")

const emit = defineEmits(["update:verified-cart"])

const props = defineProps({
	cartID: {
		type: String,
		required: true,
	},
})

const cartItems = ref([])

watch(props, async () => {
	try {
		const cart = await $fetch(`/api/verification/pendingCart?cartID=${props.cartID}`)
		cartItems.value = cart.CartItems.map((cartItem) => {
			return { name: cartItem.Item.name, imgURL: cartItem.Item.imgURL, itemID: cartItem.itemID, count: cartItem.count }
		})
	} catch (e) {
		cartItems.value = []
	}
})

const rejectCart = async () => {
	await $fetch("/api/verification/cartVerificationAction", {
		method: "POST",
		body: { cartID: props.cartID, action: "REJECT", reason: "rejected for some reason" },
	})
	emit("update:verified-cart")
}

const acceptCart = async () => {
	await $fetch("/api/verification/cartVerificationAction", {
		method: "POST",
		body: { cartID: props.cartID, action: "ACCEPT", reason: "accepted for some reason" },
	})
	emit("update:verified-cart")
}
</script>
