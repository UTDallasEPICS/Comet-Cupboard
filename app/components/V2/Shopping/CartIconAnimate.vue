<template>
	<div>
		<!-- CART ICON -->
		<div class="z-50 cursor-pointer" :class="{ 'opacity-50 cursor-not-allowed': cartDisabled }" @click="toggleCart">
			<div class="relative w-[67px] h-[66px] bg-[#154734] rounded-md flex items-center justify-center">
				<ShoppingCartIcon class="absolute top-2 left-0 w-full h-full text-white" />

				<!-- animated squares -->
				<div
					class="absolute left-[30%] top-[40%] w-[15%] h-[12%] bg-white transform transition-all duration-300 origin-bottom rounded-sm"
					:class="cartView ? 'translate-x-[-40%] translate-y-[-180%] rotate-[-45deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'"
				/>
				<div
					class="absolute left-[33%] top-[30%] w-[15%] h-[12%] bg-white transform transition-all duration-300 origin-bottom rounded-sm"
					:class="cartView ? 'translate-x-[0%] translate-y-[-200%] rotate-[60deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'"
				/>
				<div
					class="absolute left-[55%] top-[32%] w-[15%] h-[12%] bg-white transform transition-all duration-300 origin-bottom rounded-sm"
					:class="cartView ? 'translate-x-[40%] translate-y-[-180%] rotate-[-60deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'"
				/>

				<!-- orange bubble with total items -->
				<div
					v-if="cartTotalCount > 0"
					class="absolute w-6 h-6 bg-[#E87500] rounded-full right-0 top-2 -translate-x-1/6 flex items-center justify-center text-white text-sm font-bold"
				>
					{{ cartAdjustedCount }}
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
			<div v-if="cartView" class="fixed top-20 left-0 w-full h-full z-40 bg-gray-100 overflow-auto flex flex-col items-center pt-16">
				<V2ShoppingOrangeBanner ref="bannerRef" title="Preview Cart" :top-offset="80" />

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
						:total-qty="cartTotalCount"
						:adjusted-qty="cartAdjustedCount"
						:checked="checked"
						:header-gap="headerGap"
						:row-gap="rowGap"
						:label-width="labelWidth"
						@update:checked="(val) => (checked = val)"
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
import { ShoppingCartIcon } from "@heroicons/vue/24/solid"
const router = useRouter()

const store = useCartStore()
const { toggleCartView } = store
const { cartView, cartTotalCount, cartAdjustedCount } = storeToRefs(store)

// reactive states
const checked = ref(false)
const bannerRef = ref(null)
const bannerHeight = ref(0)
const headerGap = 12
const rowGap = 12
const labelWidth = 100

// disable cart toggle on certain pages
const cartDisabled = computed(() => {
	const disabledRoutes = ["/v2/shopping/terms", "/v2/shopping/cart_pending", "/v2/shopping/accepted", "/v2/shopping/rejected"]
	return disabledRoutes.includes(router.currentRoute.value.path)
})

const toggleCart = () => {
	if (!cartDisabled.value) {
		toggleCartView()
	}
}

// remove and update qty
const removeFromCart = (index) => store.removeFromCart(store.cart.CartItems[index].Item.name)
const updateQty = (index, val) => {
	const item = store.cart.CartItems[index]
	if (!item) return
	item.count = Number(val) || 0
	if (item.expiredCount > item.count) item.expiredCount = item.count
}
const updateQty2 = (index, val) => {
	const item = store.cart.CartItems[index]
	if (!item) return
	item.expiredCount = Number(val) || 0
	if (item.expiredCount > item.count) item.expiredCount = item.count
}

onMounted(() => {
	console.log("CartIconAnimate mounted")
	if (bannerRef.value) bannerHeight.value = bannerRef.value.offsetHeight
})

// submit cart
const submitCart = async () => {
	localStorage.setItem("submittedCart", JSON.stringify(store.cart.CartItems))
	await router.push("/v2/shopping/terms")
	store.toggleCartView()
}
</script>
