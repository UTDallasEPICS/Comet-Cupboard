<template lang="pug">
div.grid.gap-4.p-4
    CartItemCard(v-for="cartItem in cartItems" 
        :name="cartItem.name" :imgURL="cartItem.imgURL" :itemID="cartItem.itemID" :count="cartItem.count" :editMode="editMode"
        @update:cart="getCart")
</template>

<script lang="ts" setup>
const cartItems = ref()

onMounted(async () => {
	await getCart()
})

const getCart = async () => {
	const cart = await $fetch("/api/cart/cart", { method: "GET" })
	cartItems.value = cart.CartItems.map((cartItem) => {
		return { name: cartItem.Item.name, imgURL: cartItem.Item.imgURL, itemID: cartItem.itemID, count: cartItem.count }
	})
}

const props = defineProps({
	editMode: {
		type: Boolean,
		required: true,
	},
})
</script>
