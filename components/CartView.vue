<template lang="pug">
div.w-full.sm_w-80.drop-shadow-standard.bg-white.flex.flex-col.text-xl
	div.relative.h-12.w-full.bg-utd-orange.content-center
		p.text-3xl.text-center.font-bold.text-white Cart View
		button(@click="$emit('closeCartView')").absolute.inset-y-0.right-2
			XMarkIcon.size-10.fill-white.stroke-white.hover_fill-black.hover_stroke-black
	div.px-5.py-5.h-full.flex.flex-col.gap-y-4.overflow-y-scroll
		CartItemCard(
			v-for="cartItem in cartItems"
			:key="cartItem"
			@update:cart="getCart"
			:count="cartItem.count"
			:expiredCount="cartItem.expiredCount"
			:imgName="cartItem.Item.imgName"
			:itemID="cartItem.itemID"
			:name="cartItem.Item.name"
			:showExpired="markExpiredItems"
		)
		div.w-full.mt-auto.flex.flex-col.gap-y-2
			div.flex.flex-row.justify-between
				p Total QTY
				p.w-2.text-center {{ cartTotalCount }}
			div.flex.flex-row.justify-between
				p Adjusted QTY
				p.w-2.text-center {{ cartAdjustedCount }}
			div(@click="toggleMarkExpiredItems").flex.flex-row.w-min.cursor-pointer
				div.bg-utd-green.rounded-md.w-6.h-6
					CheckIcon(v-show="markExpiredItems").fill-white.stroke-white.h-6
				p.ml-2.text-nowrap.hover_underline Mark Expired Items
			div(class="h-[1px]").bg-black

			// Pending Review Pop-Up
			Modal(v-if="currentModal == ModalType.PENDING" title="Pending Review" @toggleModal="closeModal")
				div.flex.flex-col.p-5
					div.text-xl.h-20
						| Your cart has been submitted, please take it to a volunteer for review.
					div.flex.flex-row.mt-auto
						button(@click="retractCart").modal-button.bg-utd-orange.text-white.ml-auto.w-full.sm_w-32.mr-5
							| Edit Cart
						button(@click="closeModal").modal-button.bg-utd-green.text-white.w-full.sm_w-32
							| Close

			// Rejected Pop-Up
			Modal(v-if="currentModal == ModalType.REJECTED" title="Cart Rejected" @toggleModal="closeModal")
				div.flex.flex-col.p-5
					div.text-xl.h-20
						| Your cart has been rejected, possible reasons include:
					div.flex.flex-row.mt-auto
						button(@click="closeModal").modal-button.bg-utd-green.text-white.w-full.sm_w-32.ml-auto
							| Close

			// Accepted Pop-Up
			Modal(v-if="currentModal == ModalType.ACCEPTED" title="Cart Accepted" @toggleModal="closeModal")
				div.flex.flex-col.p-5
					div.text-xl.h-20
						| Your cart has been approved!
					div.flex.flex-row.mt-auto
						button(@click="closeModal").modal-button.bg-utd-green.text-white.w-full.sm_w-32.ml-auto
							| Close

			button(v-if="pending" @click="currentModal = ModalType.PENDING").bg-utd-green.text-white.w-full.button Pending Cart...
			button(v-else @click="submitCart").button.bg-utd-green.text-white.w-full Submit Cart
</template>

<script setup lang="ts">
import { XMarkIcon, CheckIcon } from "@heroicons/vue/24/solid"
import { useCartStore } from "~/stores/cart"

const { cartItems, cartTotalCount, cartAdjustedCount, pending, getCart } = useCartStore()

const markExpiredItems = ref(false)
const currentModal = ref("")
const verificationUpdate = ref<EventSource>()

const ModalType = Object.freeze({
	PENDING: "PENDING",
	ACCEPTED: "ACCEPTED",
	REJECTED: "REJECTED",
})

if (import.meta.client) {
	// change this to use env later
	// also probably use zod to type check the message...
	verificationUpdate.value = new EventSource("http://localhost:3000/api/verification/cartRequestVerificationResponseWaiting")
	verificationUpdate.value.onmessage = async (event) => {
		// put a better response as to accepted or declined cart later
		const { type, payload } = JSON.parse(event.data)
		if (type === "REJECT CART") {
			currentModal.value = ModalType.REJECTED
		}
		if (type === "ACCEPT CART") {
			currentModal.value = ModalType.ACCEPTED
		}
		await getCart()
	}
}

const toggleMarkExpiredItems = async () => {
	markExpiredItems.value = !markExpiredItems.value
	// reset all expired counts to 0 because we want users to clearly know if they are marking expired items in cart
	if (!markExpiredItems.value) {
		cartItems.forEach((cartItem) => {
			$fetch("/api/cart/cartItem", { method: "POST", body: { itemID: cartItem.itemID, incrementChange: 0, expiredCount: 0 } })
		})
		await getCart()
	}
}

const submitCart = async () => {
	await $fetch("/api/verification/cartRequestVerification", { method: "POST" })
	await getCart()
	currentModal.value = ModalType.PENDING
}

const retractCart = async () => {
	await $fetch("/api/verification/retractCart", { method: "PUT" })
	closeModal()
}

const closeModal = () => {
	currentModal.value = ""
}

onMounted(async () => {
	await getCart()
})
</script>
