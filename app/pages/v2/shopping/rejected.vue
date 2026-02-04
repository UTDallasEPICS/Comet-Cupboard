<template>
	<div>
		<!-- banner -->
		<V2ShoppingOrangeBanner title="Rejected" :topOffset="80" />

		<!-- checkout Flow status -->
		<div class="font-montserrat relative flex min-h-screen justify-center bg-gray-100">
			<div class="relative w-full" style="max-width: 320px">
				<div ref="checkoutRef" class="mt-7 flex w-full justify-center" :style="{ height: checkoutHeight + 'px' }">
					<V2ShoppingCheckoutFlow class="w-full" :ellipseColors="ellipseColors" />
				</div>

				<!-- status txt -->
				<div class="mt-8 text-center">
					<p class="font-montserrat mb-2 font-bold text-black" style="font-size: 25px">Status</p>
					<p class="font-montserrat font-bold text-black" style="font-size: 25px">Rejected</p>
				</div>

				<!-- rejection message comp -->
				<div class="mt-6 flex justify-center">
					<V2ShoppingRejectionMessage :message="cartVerificationReason" />
				</div>

				<!-- back to shop button -->
				<div class="absolute" style="top: 360px; left: 70px; transform: translateX(50%)">
					<V2ShoppingBasicButton label="Go Back" color="#E87500" class="w-[200px]" @click="goBackToShop" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const ellipseColors = ["#154734", "#154734", "#E87500"]
const checkoutHeight = 57

const store = useCartStore()
const { cartVerificationReason } = storeToRefs(store)

const goBackToShop = async () => {
	await navigateTo("/v2/shopping")
}
</script>
