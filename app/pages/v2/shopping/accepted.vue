<template lang="pug">
//- banner
V2ShoppingOrangeBanner(
  title="Accepted"
  :topOffset="80"
)

//- checkoutflow status
div.min-h-screen.bg-gray-100.font-montserrat.flex.justify-center.relative
  div.w-full.relative(style="max-width: 320px")
    
    div(
      ref="checkoutRef"
      class="w-full flex justify-center mt-7"
      :style="{ height: checkoutHeight + 'px' }"
    )
      V2ShoppingCheckoutFlow.w-full(:ellipseColors="ellipseColors")
    
    //- status accepted mesage
    div.flex.flex-col.items-center(style="margin-top: 20px")
      h2.font-bold.text-black(style="font-size: 25px") Status
      p.font-bold.mt-2(style="font-size: 25px; color: #154734") Accepted
    
    //- countdown comp
    div(style="margin-top: 40px")
      V2ShoppingAcceptedMessage(:countdown="countdown")
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart"

const countdown = ref(5)
const store = useCartStore()
const { getCart } = store

// checkout flow colors
const checkoutHeight = 50
const ellipseColors = ["#154734", "#154734", "#154734"]

onMounted(() => {
	const timer = setInterval(() => {
		if (countdown.value > 1) {
			countdown.value--
		} else {
			clearInterval(timer)
			getCart()
      logout()
		}
	}, 1000)
})

const logout = async () => {
	try {
		await $fetch("/api/cart/cart", {
			method: "DELETE",
		})
	} catch (err) {
		//We don't care about this error, we just don't want this to stop us though
	}

	// If the user is in the queue, remove them from the queue
	try {
		await $fetch("/api/queue", {
			method: "DELETE",
			body: {
				netID: useCookie("netID").value,
			},
		})
	} catch (err) {
		//We don't care about this error, we just don't want this to stop us though
	}

	const netIDCookie = useCookie("netID")
	const accessCookie = useCookie("AccessPermission")
	netIDCookie.value = null
	accessCookie.value = null
	await navigateTo("/")
}
</script>
