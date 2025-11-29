<template>
	<div class="min-h-screen bg-gray-100 font-montserrat flex justify-center pt-12 pb-12 px-4">
		<div class="w-full max-w-[320px] relative">
			<!-- orange banner -->
			<V2ShoppingOrangeBanner title="Pending Cart" :topOffset="80" />

			<!-- checkout flow  -->
			<div ref="checkoutRef" class="w-full flex justify-center mt--100" :style="{ height: checkoutHeight + 'px' }">
				<V2ShoppingCheckoutFlow class="w-full" :ellipseColors="ellipseColors" />
			</div>

			<!-- Status Text -->
			<div class="mt-[20px] flex flex-col items-center">
				<h2 class="font-bold text-[25px] text-black">Status</h2>
				<p class="font-bold text-[25px] text-[#154734] mt-2">Accepted</p>
			</div>

			<!-- Full-Width Accepted Banner with Countdown -->
			<div class="mt-[40px]">
				<V2ShoppingAcceptedMessage :countdown="countdown" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const countdown = ref(5)

// checkout flow colors
const checkoutHeight = 50
const ellipseColors = ["#154734", "#154734", "#154734"]

onMounted(() => {
	const timer = setInterval(async () => {
		if (countdown.value > 1) {
			countdown.value--
		} else {
			clearInterval(timer)
			await navigateTo("/v2/shopping")
		}
	}, 1000)
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap");
.font-montserrat {
	font-family: "Montserrat", sans-serif;
}
</style>
