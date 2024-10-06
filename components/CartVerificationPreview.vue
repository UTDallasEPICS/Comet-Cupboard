<template lang="pug">
//- TODO: don't make this fixed height, make h-max the height of page - margins, then overflow will scroll content
div.w-full.h-auto.flex.flex-col.gap-y-4
	div.h-12.rounded-xl.drop-shadow.bg-gray-300.flex.flex-row.justify-between
		span.px-4.text-xl.text-left.my-auto {{ cartID }}
		span.px-4.text-xl.text-right.my-auto QTY: 2
	div.border-black.border-2.h-full.rounded-xl.drop-shadow.p-4
		div.w-72.h-8.rounded(style="background-color: #FFAB00")
			ExclamationTriangleIcon.size-8.inline
			p.inline Cart has expired items
		p a
//- div.border-black.border-4.flex.flex-col.flex-nowrap.h-fit
//- 	div.border-black.border-b-4
//- 		p {{ cartID }}
//- 	div.border-black.border-b-4.grid.gap-4.p-4(class="grid-cols-1 lg:grid-cols-2")
//- 		CartItemVerifyCard(v-for="cartItem in cartItems" 
//-             :name="cartItem.name" :imgURL="cartItem.imgURL" :itemID="cartItem.itemID" :count="cartItem.count")
//- 	div.flex.flex-row
//- 		p reason
//- 		ActionButton.block.w-72.h-min(class="sm:flex-grow-0" style="background-color: #FF0000" @click="rejectCart")
//- 			p Reject
//- 		ActionButton.block.w-72.h-min(class="sm:flex-grow-0" @click="acceptCart")
//- 			p Accept
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from "@heroicons/vue/24/solid"

const emit = defineEmits(["update:verified-cart"])

const props = defineProps({
	cartID: {
		type: String,
		required: true,
	},
})

const cartItems = ref([])

// watch(props, async () => {
// 	try {
// 		const cart = await $fetch(`/api/verification/pendingCart?cartID=${props.cartID}`)
// 		cartItems.value = cart.CartItems.map((cartItem) => {
// 			return { name: cartItem.Item.name, imgURL: cartItem.Item.imgURL, itemID: cartItem.itemID, count: cartItem.count }
// 		})
// 	} catch (e) {
// 		cartItems.value = []
// 	}
// })

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
