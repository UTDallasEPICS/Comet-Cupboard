<template>
	<div class="min-h-screen bg-gray-100 font-montserrat flex justify-center pt-12 pb-12 px-4">
		<div class="w-full max-w-[320px] relative">
			<!-- Orange Banner -->
			<V2ShoppingOrangeBanner title="Results" :topOffset="80" />

			<!-- Checkout Flow -->
			<div ref="checkoutRef" class="w-full flex justify-center" :style="{ height: checkoutHeight + 'px', marginTop: '-10px' }">
				<V2ShoppingCheckoutFlow class="w-full" :ellipseColors="ellipseColors" />
			</div>

			<!-- Status Text -->
			<div class="text-center mt-8">
				<p class="font-montserrat font-bold text-[25px] text-black mb-2">Status</p>
				<p class="font-montserrat font-bold text-[25px] text-black">Rejected</p>
			</div>

			<!-- Rejection Message Component -->
			<div class="flex justify-center mt-6">
				<V2ShoppingRejectionMessage :message="rejectionReason" />
			</div>

			<!-- Back to Shop Button -->
			<div class="flex justify-center mt-6">
				<V2ShoppingBasicButton label="Back to Shop" color="#E87500" :top="320" :left="50" class="w-[200px]" @click="goBackToShop" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue"

// router
const router = useRouter()

// green flow circles
const ellipseColors = ["#154734", "#154734", "#E87500"]

// height for flow section
const checkoutHeight = 57

// rejection reason (dynamic, can be updated based on logic or data)
const rejectionReason = ref("The item was expired and cannot be added to the cart.")

// navigate back to shop

const goBackToShop = async () => {
	await navigateTo("/v2/shopping")
}
</script>

<style scoped></style>
