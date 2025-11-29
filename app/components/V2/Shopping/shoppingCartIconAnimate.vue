<template>
	<div>
		<!-- CART ICON -->
		<div class="fixed top-2 right-4 z-50 cursor-pointer" :class="{ 'opacity-50 cursor-not-allowed': cartDisabled }" @click="toggleCart">
			<div class="relative w-[67px] h-[66px] bg-[#154734] rounded-md flex items-center justify-center">
				<!-- cart SVG -->
				<svg class="absolute top-0 left-0 w-full h-full" viewBox="0 0 67 66" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M52.2619 45.3908L56.9399 25.0438C57.2777 23.5747 56.1481 22.1758 54.624 22.1758H15.755L14.8479 17.7924C14.6219 16.6998 13.6493 15.9152 12.5211 15.9152H2.375C1.06331 15.9152 0 16.9663 0 18.2629V19.828C0 21.1247 1.06331 22.1758 2.375 22.1758H9.29051L16.2421 55.7713C14.579 56.7167 13.4583 58.4895 13.4583 60.522C13.4583 63.5474 15.9394 66 19 66C22.0606 66 24.5417 63.5474 24.5417 60.522C24.5417 58.9887 23.9037 57.6035 22.8768 56.6091H43.6231C42.5963 57.6035 41.9583 58.9887 41.9583 60.522C41.9583 63.5474 44.4394 66 47.5 66C50.5606 66 53.0417 63.5474 53.0417 60.522C53.0417 58.3531 51.7663 56.4788 49.9167 55.5913L50.4626 53.2166C50.8004 51.7475 49.6708 50.3485 48.1467 50.3485H21.5845L20.9368 47.2182H49.946C51.0549 47.2182 52.0162 46.4597 52.2619 45.3908Z"
						fill="white"
					/>
				</svg>

				<!-- animated squares -->
				<div
					class="absolute left-[30%] top-[40%] w-[15%] h-[12%] bg-white transform transition-all duration-300 origin-bottom rounded-sm"
					:class="
						cartViewLocal ? 'translate-x-[-40%] translate-y-[-180%] rotate-[-45deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'
					"
				/>
				<div
					class="absolute left-[33%] top-[30%] w-[15%] h-[12%] bg-white transform transition-all duration-300 origin-bottom rounded-sm"
					:class="
						cartViewLocal ? 'translate-x-[0%] translate-y-[-200%] rotate-[60deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'
					"
				/>
				<div
					class="absolute left-[55%] top-[32%] w-[15%] h-[12%] bg-white transform transition-all duration-300 origin-bottom rounded-sm"
					:class="
						cartViewLocal ? 'translate-x-[40%] translate-y-[-180%] rotate-[-60deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'
					"
				/>

				<!-- orange bubble with total items -->
				<div
					v-if="totalQty > 0"
					class="absolute w-6 h-6 bg-[#E87500] rounded-full right-0 top-[18%] -translate-x-1/6 flex items-center justify-center text-white text-sm font-bold"
				>
					{{ totalQty }}
				</div>
			</div>
		</div>

		<!-- SLIDE-OUT CART -->
		<transition
			enter-active-class="transition ease-in-out duration-300"
			enter-from-class="translate-x-full opacity-0"
			enter-to-class="translate-x-0 opacity-100"
			leave-active-class="transition ease-in-out duration-300"
			leave-from-class="translate-x-0 opacity-100"
			leave-to-class="translate-x-full opacity-0"
		>
			<div v-if="cartViewLocal" class="fixed top-20 left-0 w-full h-full z-40 bg-gray-100 overflow-auto flex flex-col items-center pt-16">
				<V2ShoppingOrangeBanner title="Preview Cart" :topOffset="80" ref="bannerRef" />

				<div class="flex flex-col gap-4 w-full max-w-[320px]" :style="{ marginTop: bannerHeight + 'px' }">
					<div v-for="(item, index) in store.cart.CartItems" :key="item.Item.name" class="relative">
						<V2ShoppingCartItem
							:item-name="item.Item.name"
							:qty="item.count"
							:qty2="item.expiredCount"
							:show-expired="checked"
							@update:qty="(val) => updateQty(index, val)"
							@update:qty2="(val) => updateQty2(index, val)"
							@remove="removeFromCart(index)"
						/>

						<!-- badges -->
						<div class="absolute right--1 top-0 flex items-center gap-1">
							<V2ShoppingDealBadge
								v-if="item.Item.badge === 'deal'"
								badge="deal"
								:quantity="item.Item.quantity ?? 3"
								:countsAs="item.Item.countsAs ?? 1"
								class="relative -translate-y-2"
							/>
							<V2ShoppingFreeBadge v-else-if="item.Item.badge === 'free'" class="relative -translate-y-2" />
						</div>
					</div>

					<div v-if="store.cart.CartItems.length === 0" class="text-center text-gray-500 mt-4">Your cart is empty</div>
				</div>

				<div class="w-full max-w-[320px] flex justify-end mt-4 mb-2">
					<V2ShoppingCheckoutCount
						v-model:totalQty="totalQty"
						v-model:adjustedQty="adjustedQty"
						v-model:checked="checked"
						:header-gap="headerGap"
						:row-gap="rowGap"
						:label-width="labelWidth"
					/>
				</div>

				<div class="w-full max-w-[320px] flex justify-center mt-2 mb-8">
					<V2ShoppingSubmitCart @click="submitCart" />
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, defineExpose } from "vue"
import { useRouter } from "vue-router"
import { useCartStore } from "@/stores/cart"

const router = useRouter()
const store = useCartStore()

// reactive states
const checked = ref(false)
const bannerRef = ref(null)
const bannerHeight = ref(0)
const totalQty = ref(0)
const adjustedQty = ref(0)
const headerGap = 12
const rowGap = 12
const labelWidth = 100

// disable cart toggle on certain pages
const cartDisabled = computed(() => {
	const disabledRoutes = ["/v2/shopping/terms", "/v2/shopping/cart_pending", "/v2/shopping/accepted", "/v2/shopping/rejected"]
	return disabledRoutes.includes(router.currentRoute.value.path)
})

// toggle cart
const cartViewLocal = computed({
	get: () => store.cartView,
	set: (v) => (store.cartView = v),
})
const toggleCart = () => {
	if (!cartDisabled.value) store.toggleCartView()
}

// compute adjusted qty
function computeAdjustedQty() {
	return store.cart.CartItems.reduce((sum, item) => {
		const effectiveCount = (item.count || 0) - (item.expiredCount || 0)
		if (item.Item.badge === "deal" && item.Item.quantity && item.Item.countsAs) {
			const deals = Math.floor(effectiveCount / item.Item.quantity) * item.Item.countsAs
			const remainder = effectiveCount % item.Item.quantity
			return sum + deals + remainder
		}
		if (item.Item.badge === "free") return sum
		return sum + effectiveCount
	}, 0)
}

// watch cart changes
watch(
	() => store.cart.CartItems,
	() => {
		totalQty.value = store.cartTotalCount
		adjustedQty.value = computeAdjustedQty()
	},
	{ deep: true, immediate: true }
)

// remove and update qty
const removeFromCart = (index) => store.removeFromCart(store.cart.CartItems[index].Item.name)
const updateQty = (index, val) => {
	const item = store.cart.CartItems[index]
	if (!item) return
	item.count = Number(val) || 0
	if (item.expiredCount > item.count) item.expiredCount = item.count
	adjustedQty.value = computeAdjustedQty()
}
const updateQty2 = (index, val) => {
	const item = store.cart.CartItems[index]
	if (!item) return
	item.expiredCount = Number(val) || 0
	if (item.expiredCount > item.count) item.expiredCount = item.count
	adjustedQty.value = computeAdjustedQty()
}

onMounted(() => {
	if (bannerRef.value) bannerHeight.value = bannerRef.value.offsetHeight
})

// submit cart
const submitCart = async () => {
	localStorage.setItem("submittedCart", JSON.stringify(store.cart.CartItems))
	await router.push("/v2/shopping/terms")
	store.toggleCartView()
}

// expose addToCart
defineExpose({
	addToCart: (item) => {
		store.addToCart(item)
		nextTick(() => (adjustedQty.value = computeAdjustedQty()))
	},
})
</script>
