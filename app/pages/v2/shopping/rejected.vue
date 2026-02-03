<template lang="pug">
//- banner
V2ShoppingOrangeBanner(
  title="Rejected"
  :topOffset="80"
)

//- checkout Flow status
div.min-h-screen.bg-gray-100.font-montserrat.flex.justify-center.relative
  div.w-full.relative(style="max-width: 320px")
    
    div(
      ref="checkoutRef"
      class="w-full flex justify-center mt-7"
      :style="{ height: checkoutHeight + 'px' }"
    )
      V2ShoppingCheckoutFlow.w-full(:ellipseColors="ellipseColors")
    
    //- status txt
    div.text-center.mt-8
      p.font-montserrat.font-bold.text-black.mb-2(style="font-size: 25px") Status
      p.font-montserrat.font-bold.text-black(style="font-size: 25px") Rejected
    
    //- rejection message comp
    div.flex.justify-center.mt-6
      V2ShoppingRejectionMessage(:message="cartVerificationReason")
    
    //- back to shop button
    div.absolute(style="top: 360px; left: 70px; transform: translateX(50%)")
      V2ShoppingBasicButton(
        label="Go Back"
        color="#E87500"
        class="w-[200px]"
        @click="goBackToShop"
      )
</template>

<script setup lang="ts">
const ellipseColors = ['#154734', '#154734', '#E87500']
const checkoutHeight = 57

const store = useCartStore()
const { cartVerificationReason } = storeToRefs(store)

const goBackToShop = async () => {
  await navigateTo('/v2/shopping')
}

</script>
