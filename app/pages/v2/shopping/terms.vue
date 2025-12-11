<template lang="pug">

//- banner
V2ShoppingOrangeBanner(
  title="Terms and Conditions"
  :topOffset="80"
)

//- checkout flow
div.min-h-screen.bg-gray-100.font-montserrat.flex.justify-center
  div.w-full.relative(style="max-width: 320px")
    div(
      ref="checkoutRef"
      class="w-full flex justify-center mt-7"
      :style="{ height: checkoutHeight + 'px' }"
    )
      V2ShoppingCheckoutFlow.w-full(:ellipseColors="ellipseColors")

    //- scrollable terms
    div.flex-1.overflow-auto.mt-4.mb-4
      div.text-left.text-black.space-y-3(style="font-size: 16px; line-height: 20px")
        p.font-bold Statement of Understanding:
        p
          | I assume any and all risks associated with consuming the items I have selected from the Comet Cupboard. I agree to release UT Dallas
          | from liability if I sustain any health or medical issues as a result of consuming foods taken from the Comet Cupboard. I understand that
          | the Comet Cupboard distributes products that may contain nuts or have been processed in plants that use peanuts and/or tree nuts. I also
          | understand that some of Comet Cupboard items may conflict with my allergies or dietary restrictions.
        p
          span.font-bold Non-Discrimination Clause:
        p
          | UTD Comet Cupboard does not and shall not discriminate on the basis of race,
          | color, religion (creed), gender, gender expression, age, national origin (ancestry), disability, marital status, sexual orientation, or
          | military status, in any of its activities or operations.
        div(style="height: 40px")
    
    //- buttons at the bottom
    V2ShoppingBasicButton(
      label="Cancel"
      color="#4A4A4A"
      :top="620"
      :left="0"
      class="w-[150px]"
      @click="goToItemsPage"
    )
    V2ShoppingBasicButton(
      label="Confirm"
      color="#154734"
      :top="620"
      :left="165"
      class="w-[150px]"
      @click="goToCartPendingPage"
    )
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
