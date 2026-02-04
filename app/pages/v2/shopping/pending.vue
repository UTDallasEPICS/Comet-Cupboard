<template>
	<div>
		<!-- banner -->
		<V2ShoppingOrangeBanner title="Pending Cart" :topOffset="80" />

		<!-- checkout Flow status -->
		<div class="font-montserrat relative flex min-h-screen justify-center bg-gray-100">
			<div class="relative w-full" style="max-width: 320px">
				<div ref="checkoutRef" class="mt-7 flex w-full justify-center" :style="{ height: checkoutHeight + 'px' }">
					<V2ShoppingCheckoutFlow class="w-full" :ellipseColors="ellipseColors" />
				</div>

				<!-- pending cart item display -->
				<div class="mt-3 flex flex-col gap-3">
					<V2ShoppingPendingCartItem v-for="(item, index) in cart" :key="index" :item="item" />
					<div class="mt-4 text-center text-gray-500" v-if="cart.length === 0">No pending items</div>
				</div>

				<!-- checkout count display -->
				<div class="mt-6 mb-4 flex w-full flex-col items-center">
					<V2ShoppingCheckoutCount :cartTotalCount="cartTotalCount" :cartAdjustedCount="cartAdjustedCount" :markExpiredItems="false" />
				</div>

				<!-- cancel button -->
				<div class="mb-20 flex w-full justify-center" style="position: relative">
					<V2ShoppingBasicButton label="Cancel" color="#9CA3AF" style="width: 320px; height: 40px" @click="showCancelConfirm = true" />
				</div>

				<!-- cancel confirmation model -->
				<div class="fixed inset-0 z-50 flex items-center justify-center" v-if="showCancelConfirm" style="background-color: rgba(0, 0, 0, 0.4)">
					<div class="rounded-xl bg-white p-6 text-center" style="width: 280px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5)">
						<p class="mb-4 font-bold text-black">Are you sure you want to cancel?</p>
						<div class="flex justify-around gap-4">
							<V2ShoppingBasicButton
								label="Cancel"
								color="#9CA3AF"
								style="position: relative; width: 110px; height: 40px"
								@click="confirmCancel"
							/>
							<V2ShoppingBasicButton
								label="Stay"
								color="#154734"
								style="position: relative; width: 110px; height: 40px"
								@click="showCancelConfirm = false"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useCartStore } from "@/stores/cart"

const store = useCartStore()
const { cartTotalCount, cartAdjustedCount } = storeToRefs(store)

const cart = ref([])
const checkoutHeight = 50
const ellipseColors = ["#154734", "#E87500", "#4A4A4A"]

const showCancelConfirm = ref(false)

// Block scrolling when modal is open
watch(showCancelConfirm, (val) => {
	document.body.style.overflow = val ? "hidden" : ""
})

// Cancel - go back
const confirmCancel = async () => {
  await $fetch("/api/verification/retractCart", { method: "PUT" })
  await navigateTo("/v2/shopping")
}


onMounted(() => {
	document.body.style.overflow = ""
	const rawCart = store.cart.CartItems || []
	cart.value = rawCart.map((i) => ({
		name: i.Item.name,
		qty: i.count,
		qty2: i.expiredCount || 0,
		badge: i.Item.badge,
		quantity: i.Item.quantity,
		countsAs: i.Item.countsAs,
		imgName: i.Item.imgName || null,
	}))
})
</script>
