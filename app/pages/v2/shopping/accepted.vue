<template>
	<div>
		<!-- banner -->
		<V2ShoppingOrangeBanner title="Accepted" :topOffset="80" />

		<!-- checkout Flow status -->
		<div class="font-montserrat relative flex min-h-screen justify-center bg-gray-100">
			<div class="relative w-full" style="max-width: 320px">
				<div ref="checkoutRef" class="mt-7 flex w-full justify-center" :style="{ height: checkoutHeight + 'px' }">
					<V2ShoppingCheckoutFlow class="w-full" :ellipseColors="ellipseColors" />
				</div>

				<!-- status accepted mesage -->
				<div class="mt-5 flex flex-col items-center">
					<h2 class="font-bold text-black" style="font-size: 25px">Status</h2>
					<p class="mt-2 font-bold" style="font-size: 25px; color: #154734">Accepted</p>
				</div>

				<!-- countdown comp -->
				<div class="mt-10">
					<V2ShoppingAcceptedMessage :countdown="countdown" />
				</div>
			</div>
		</div>
	</div>
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
