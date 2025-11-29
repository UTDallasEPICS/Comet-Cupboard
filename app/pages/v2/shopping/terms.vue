<template>
	<!-- Full-page flex container to center content -->
	<div class="min-h-screen bg-gray-100 font-montserrat flex justify-center pt-12 pb-12 px-4">
		<!-- Main content container -->
		<div class="w-full max-w-[320px] relative">
			<!-- Orange Banner -->
			<V2ShoppingOrangeBanner title="Terms and Conditions" :topOffset="80" />

			<!-- Checkout Flow Component -->
			<div ref="checkoutRef" class="w-full flex justify-center mt-1" :style="{ height: checkoutHeight + 'px' }">
				<V2ShoppingCheckoutFlow class="w-full" :ellipseColors="ellipseColors" />
			</div>

			<!-- Scrollable Agreements Section -->
			<div class="flex-1 overflow-auto mt-4 mb-4">
				<div class="text-left text-[16px] leading-[20px] text-black space-y-3">
					<!-- <p><span class="font-bold">Statement of Understanding:</span> I assume any and all risks associated with consuming the items I have selected from the Comet Cupboard. I agree to release UT Dallas from liability if I sustain any health or medical issues as a result of consuming foods taken from the Comet Cupboard. I understand that the Comet Cupboard distributes products that may contain nuts or have been processed in plants that use peanuts and/or tree nuts. I also understand that some of Comet Cupboard items may conflict with my allergies or dietary restrictions.</p> -->
					<p class="font-bold">Statement of Understanding:</p>
					<p>
						I assume any and all risks associated with consuming the items I have selected from the Comet Cupboard. I agree to release UT Dallas
						from liability if I sustain any health or medical issues as a result of consuming foods taken from the Comet Cupboard. I understand that
						the Comet Cupboard distributes products that may contain nuts or have been processed in plants that use peanuts and/or tree nuts. I also
						understand that some of Comet Cupboard items may conflict with my allergies or dietary restrictions.
					</p>

					<p>
						<span class="font-bold">Non-Discrimination Clause:</span> UTD Comet Cupboard does not and shall not discriminate on the basis of race,
						color, religion (creed), gender, gender expression, age, national origin (ancestry), disability, marital status, sexual orientation, or
						military status, in any of its activities or operations.
					</p>

					<div style="height: 40px"></div>
				</div>
			</div>

			<!-- Cancel Button (Gray) -->
			<V2ShoppingBasicButton label="Cancel" color="#4A4A4A" :top="580" :left="0" @click="goToItemsPage" />

			<!-- Confirm Button (Green) -->
			<V2ShoppingBasicButton label="Confirm" color="#154734" :top="580" :left="165" @click="goToCartPendingPage" />
		</div>
	</div>
</template>

<script setup>
// Navigation functions
const goToCartPendingPage = async () => await navigateTo({ path: "cart_pending" })
const goToItemsPage = async () => await navigateTo("/v2/shopping")

// Visual and layout variables
const checkoutHeight = 50
const ellipseColors = ["#E87500", "#4A4A4A", "#4A4A4A"]
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap");
.font-montserrat {
	font-family: "Montserrat", sans-serif;
}
</style>
