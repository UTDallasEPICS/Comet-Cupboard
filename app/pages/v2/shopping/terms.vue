<template>
	<div>
		<!-- banner -->
		<V2ShoppingOrangeBanner title="Terms and Conditions" :topOffset="80" />

		<!-- checkout flow -->
		<div class="font-montserrat flex min-h-screen justify-center bg-gray-100">
			<div class="relative w-full" style="max-width: 320px">
				<div ref="checkoutRef" class="mt-7 flex w-full justify-center" :style="{ height: checkoutHeight + 'px' }">
					<V2ShoppingCheckoutFlow class="w-full" :ellipseColors="ellipseColors" />
				</div>

				<!-- scrollable terms -->
				<div class="mt-4 mb-4 flex-1 overflow-auto">
					<div class="space-y-3 text-left text-black" style="font-size: 16px; line-height: 20px">
						<p class="font-bold">Statement of Understanding:</p>
						<p>
							I assume any and all risks associated with consuming the items I have selected from the Comet Cupboard. I agree to release UT Dallas
							from liability if I sustain any health or medical issues as a result of consuming foods taken from the Comet Cupboard. I understand
							that the Comet Cupboard distributes products that may contain nuts or have been processed in plants that use peanuts and/or tree
							nuts. I also understand that some of Comet Cupboard items may conflict with my allergies or dietary restrictions.
						</p>
						<p>
							<span class="font-bold">Non-Discrimination Clause:</span>
						</p>
						<p>
							UTD Comet Cupboard does not and shall not discriminate on the basis of race, color, religion (creed), gender, gender expression,
							age, national origin (ancestry), disability, marital status, sexual orientation, or military status, in any of its activities or
							operations.
						</p>
					</div>
				</div>
				<V2ShoppingBasicButton label="Cancel" color="#4A4A4A" :top="620" :left="0" class="w-[150px]" @click="goToItemsPage" />
				<V2ShoppingBasicButton label="Confirm" color="#154734" :top="620" :left="165" class="w-[150px]" @click="goToCartPendingPage" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const store = useCartStore()

// Navigation functions
const goToCartPendingPage = async () => {
  if (store.cartItems.length === 0) return

  // send the cart to verification
  await $fetch("/api/verification/cartRequestVerification", {
    method: "POST",
  })
  // navigate to pending page
  await navigateTo("/v2/shopping/pending")
}
const goToItemsPage = async () => await navigateTo("/v2/shopping")

// Visual and layout variables
const checkoutHeight = 50
const ellipseColors = ["#E87500", "#4A4A4A", "#4A4A4A"]
</script>
