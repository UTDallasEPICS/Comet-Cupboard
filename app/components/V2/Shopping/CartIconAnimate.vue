<template>
	<!-- actual cart design -->
	<div class="relative top-1 z-50 cursor-pointer" :class="{ 'cursor-not-allowed opacity-50': cartDisabled }" @click="toggleCart">
		<div class="relative flex items-center justify-center rounded-md bg-green-900" style="width: 67px; height: 66px; background-color: #154734">
			<ShoppingCartIcon class="text-white transition-colors duration-200 hover:text-[#E87500]" style="width: 56px; height: 56px" />

			<!-- cart item animate open/close -->
			<div
				class="absolute origin-bottom transform rounded-sm bg-white transition-all duration-300"
				:class="cartView ? 'translate-x-[-40%] translate-y-[-180%] rotate-[-45deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'"
				style="left: 35%; top: 40%; width: 15%; height: 12%"
			></div>

			<div
				class="absolute origin-bottom transform rounded-sm bg-white transition-all duration-300"
				:class="cartView ? 'translate-x-[0%] translate-y-[-200%] rotate-[60deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'"
				style="left: 33%; top: 30%; width: 15%; height: 12%"
			></div>

			<div
				class="absolute origin-bottom transform rounded-sm bg-white transition-all duration-300"
				:class="cartView ? 'translate-x-[40%] translate-y-[-180%] rotate-[-60deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'"
				style="left: 55%; top: 32%; width: 15%; height: 12%"
			></div>

			<!-- orange bubble -->
			<div
				v-if="cartTotalCount > 0"
				class="absolute right-0 flex items-center justify-center rounded-full text-sm font-bold text-white"
				style="width: 24px; height: 24px; background-color: #e87500; top: 18%"
			>
				{{ cartTotalCount }}
			</div>
		</div>
	</div>

	<!-- CART VIEW -->
	<transition
		enter-active-class="transition ease-in-out duration-300"
		enter-from-class="translate-x-full opacity-0"
		enter-to-class="translate-x-0 opacity-100"
		leave-active-class="transition ease-in-out duration-300"
		leave-from-class="translate-x-0 opacity-100"
		leave-to-class="translate-x-full opacity-0"
	>
		<div v-if="cartView" class="fixed top-20 left-0 z-40 flex w-full flex-col items-center bg-gray-100" style="height: calc(100vh - 5rem)">
			<!-- orange banner -->
			<V2ShoppingOrangeBanner title="Preview Cart" :topOffset="0" />

			<!-- cart items -->
			<div class="mt-4 w-full flex-1 overflow-y-auto pb-4">
				<div class="flex flex-col items-center gap-4">
					<div v-for="cartItem in cartItems" :key="cartItem.Item.name" class="relative" style="width: 320px">
						<V2ShoppingCartItem
							:key="cartItem.itemID"
							:count="cartItem.count"
							:expiredCount="cartItem.expiredCount"
							:imgName="cartItem.Item.imgName"
							:itemID="cartItem.itemID"
							:name="cartItem.Item.name"
							:itemDeal="
								cartItem.Item.Deal
									? {
											actualCount: cartItem.Item.Deal.actualCount,
											adjustedCount: cartItem.Item.Deal.adjustedCount,
										}
									: {}
							"
							:showExpired="markExpiredItems"
							@update:cart="getCart"
						/>
					</div>
				</div>

				<div v-if="cartItems.length === 0" class="mt-4 text-center text-gray-500">Your cart is empty</div>

				<!-- checkout count -->
				<div class="mt-4 mb-2 flex w-full justify-center">
					<V2ShoppingCheckoutCount
						:cartTotalCount="cartTotalCount"
						:cartAdjustedCount="cartAdjustedCount"
						:markExpiredItems="markExpiredItems"
						@toggleExpired="toggleMarkExpiredItems"
					/>
				</div>

				<!-- submit button -->
				<div class="mt-2 mb-8 flex w-full justify-center">
					<V2ShoppingSubmitCart @click="submitCart" />
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { ShoppingCartIcon } from "@heroicons/vue/24/solid"
import { useCartStore } from "~/stores/cart"


const store = useCartStore()
const { toggleCartView, resetCartView, getCart, setCartVerificationReason } = store
const { cartView, cartItems, cartTotalCount, cartAdjustedCount, pending } = storeToRefs(store)
const router = useRouter()


//disable cart in other pages
const cartDisabled = computed(() => {
	const disabledRoutes = ["/v2/shopping/terms", "/v2/shopping/pending", "/v2/shopping/accepted", "/v2/shopping/rejected"]
	return disabledRoutes.includes(router.currentRoute.value.path)
})
const emit = defineEmits(["submitCart", "retractCart"])

const markExpiredItems = ref(false)

const toggleMarkExpiredItems = async () => {
	markExpiredItems.value = !markExpiredItems.value
	if (!markExpiredItems.value) {
		cartItems.value.forEach((cartItem) => {
			$fetch("/api/cart/cartItem", { method: "POST", body: { itemID: cartItem.itemID, incrementChange: 0, expiredCount: 0 } })
		})
		await getCart()
	}
}

const toggleCart = () => {
	if (cartDisabled.value) return
	toggleCartView()
}

let verificationUpdate: EventSource | null = null

onMounted(async () => {
	const config = useRuntimeConfig()
	verificationUpdate = new EventSource(`${config.public.LOCAL_URL}api/verification/cartRequestVerificationResponseWaiting`)

	verificationUpdate.onmessage = async (event) => {
		const raw = event.data

		if (typeof raw !== "string" || !raw.trim().startsWith("{")) return

		let parsed
		try {
			parsed = JSON.parse(raw)
		} catch {
			console.warn("Ignored non-JSON SSE message:", raw)
			return
		}

		const { type, payload } = parsed
		if (type === "REJECT CART") {
      setCartVerificationReason(payload || "No reason provided.")
      await router.push("/v2/shopping/rejected")
    }
		else if (type === "ACCEPT CART") {
      setCartVerificationReason(payload || "No reason provided.")
      await router.push("/v2/shopping/accepted")
    }

		resetCartView()
	}
})

onBeforeUnmount(() => {
	if (verificationUpdate) {
		verificationUpdate.close()
		verificationUpdate = null
	}
})

const submitCart = async () => {
	if (cartItems.value.length === 0) return
	resetCartView()
	await router.push("/v2/shopping/terms")
}
</script>
