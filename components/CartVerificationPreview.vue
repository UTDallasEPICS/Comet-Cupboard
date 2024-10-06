<template lang="pug">
div.w-full.h-min.flex.flex-col.gap-y-4
	div.h-12.rounded-xl.drop-shadow.flex.flex-row.justify-between.bg-cupboard-lg
		span.px-4.text-xl.text-left.my-auto {{ cartID }}
		span.px-4.text-xl.text-right.my-auto QTY: 2
	div.border-black.border-2.h-full.rounded-xl.drop-shadow.p-4
		div.grid.place-items-center.gap-4(style="grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))")
			div.w-72.h-8.rounded.flex.flex-row(style="background-color: #FFAB00" v-for="warning in warnings")
				ExclamationTriangleIcon.my-auto.ml-1.size-7
				p.ml-1.my-auto {{ warning }}
		div.my-4.grid.place-items-center.gap-4(style="grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))")
			CartVerifyCard(v-for="cartItem in cartItems" :name="cartItem.name" :imgURL="cartItem.imgURL" :itemID="cartItem.itemID" :totalQTY="cartItem.totalQTY" :dealsCount="cartItem.dealsCount" :expiredCount="cartItem.expiredCount" :adjustedQTY="cartItem.adjustedQTY")
		div.flex.flex-row.gap-x-4.justify-center.lg_justify-end
			button.button.w-40.bg-red-negative.text-white(@click="rejectCart") Decline
			button.button.w-40.bg-utd-green.text-white(@click="acceptCart") Accept
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


const cartItems = ref([
{
	"name": "apple",
	"imgURL": "test-images/Apple_JE3_BE3.png",
	"itemID": "1",
	"totalQTY": 1,
	"dealsCount": 0,
	"expiredCount": 0,
	"adjustedQTY": 1
},

{
	"name": "baked potato",
	"imgURL": "test-images/Baked_Potato_JE4_BE2.png",
	"itemID": "1",
	"totalQTY": 1,
	"dealsCount": -1,
	"expiredCount": -1,
	"adjustedQTY": 1
},

{
	"name": "bread",
	"imgURL": "test-images/Bread_JE3_BE3.png",
	"itemID": "1",
	"totalQTY": 1,
	"dealsCount": -1,
	"expiredCount": 0,
	"adjustedQTY": 1
},

{
	"name": "cooked salmon",
	"imgURL": "test-images/Cooked_Salmon_JE2_BE2.png",
	"itemID": "1",
	"totalQTY": 1,
	"dealsCount": 0,
	"expiredCount": -1,
	"adjustedQTY": 1
},

{
	"name": "cookie",
	"imgURL": "test-images/Cookie_JE2_BE2.png",
	"itemID": "1",
	"totalQTY": 1,
	"dealsCount": 0,
	"expiredCount": 0,
	"adjustedQTY": 1
}


])
const warnings = ref<Array<string>>(["Cart exceeds 6 item limit", "Cart exceeds 1 items per category", "Cart has expired items"])

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
		body: { cartID: props.cartID, action: "REJECT" },
	})
	emit("update:verified-cart")
}

const acceptCart = async () => {
	await $fetch("/api/verification/cartVerificationAction", {
		method: "POST",
		body: { cartID: props.cartID, action: "ACCEPT" },
	})
	emit("update:verified-cart")
}
</script>
