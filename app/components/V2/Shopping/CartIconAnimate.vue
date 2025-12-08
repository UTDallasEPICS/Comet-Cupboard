<template lang="pug">
//- actual cart design
div.relative.top-1.z-50.cursor-pointer(
  :class="{ 'opacity-50 cursor-not-allowed': cartDisabled }"
  @click="toggleCart"
)
  div.relative.bg-green-900.rounded-md.flex.items-center.justify-center(
    style="width: 67px; height: 66px; background-color: #154734"
  )
    ShoppingCartIcon.text-white.transition-colors.duration-200(
      class="hover:text-[#E87500]"
      style="width: 56px; height: 56px"
    )
    //- cart item animate open/close
    div.absolute.bg-white.transform.transition-all.duration-300.origin-bottom.rounded-sm(
      :class="cartView ? 'translate-x-[-40%] translate-y-[-180%] rotate-[-45deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'"
      style="left: 35%; top: 40%; width: 15%; height: 12%"
    )
    
    div.absolute.bg-white.transform.transition-all.duration-300.origin-bottom.rounded-sm(
      :class="cartView ? 'translate-x-[0%] translate-y-[-200%] rotate-[60deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'"
      style="left: 33%; top: 30%; width: 15%; height: 12%"
    )
    
    div.absolute.bg-white.transform.transition-all.duration-300.origin-bottom.rounded-sm(
      :class="cartView ? 'translate-x-[40%] translate-y-[-180%] rotate-[-60deg] opacity-100' : 'translate-x-0 translate-y-0 rotate-0 opacity-0'"
      style="left: 55%; top: 32%; width: 15%; height: 12%"
    )
	
    //- orange bubble
    div.absolute.rounded-full.right-0.flex.items-center.justify-center.text-white.text-sm.font-bold(
      v-if="cartTotalCount > 0"
      style="width: 24px; height: 24px; background-color: #E87500; top: 18%"
    ) {{ cartTotalCount }}

//- CART VIEW
transition(
  enter-active-class="transition ease-in-out duration-300"
  enter-from-class="translate-x-full opacity-0"
  enter-to-class="translate-x-0 opacity-100"
  leave-active-class="transition ease-in-out duration-300"
  leave-from-class="translate-x-0 opacity-100"
  leave-to-class="translate-x-full opacity-0"
)

  div.fixed.top-20.left-0.w-full.z-40.bg-gray-100.flex.flex-col.items-center(
    v-if="cartView"
    style="height: calc(100vh - 5rem)"
  )
    //- orange banner
    V2ShoppingOrangeBanner(
      title="Preview Cart"
      :topOffset="0"
    )
	
    //- cart items
    div.flex-1.w-full.overflow-y-auto.mt-4.pb-4
      .flex.flex-col.items-center.gap-4
        .relative(
          v-for="cartItem in cartItems"
          :key="cartItem.Item.name"
          style="width: 320px"
        )
          V2ShoppingCartItem(
            :key="cartItem.itemID"
            :count="cartItem.count"
            :expiredCount="cartItem.expiredCount"
            :imgName="cartItem.Item.imgName"
            :itemID="cartItem.itemID"
            :name="cartItem.Item.name"
            :itemDeal="cartItem.Item.Deal ? { actualCount: cartItem.Item.Deal.actualCount, adjustedCount: cartItem.Item.Deal.adjustedCount } : {}"
            :showExpired="markExpiredItems"
            @update:cart="getCart"
          )
      
      div.text-center.text-gray-500.mt-4(v-if="cartItems.length === 0") Your cart is empty

      //- checkout Count
      div.w-full.flex.justify-center.mt-4.mb-2
        V2ShoppingCheckoutCount(
          :cartTotalCount="cartTotalCount"
          :cartAdjustedCount="cartAdjustedCount"
          :markExpiredItems="markExpiredItems"
          @toggleExpired="toggleMarkExpiredItems"
        )

      //- submit button
      .w-full.flex.justify-center.mt-2.mb-8
        V2ShoppingSubmitCart(@click="submitCart")
</template>


<script setup lang="ts">
import { useRouter } from "vue-router"
import { ShoppingCartIcon } from "@heroicons/vue/24/solid"
import { useCartStore } from "~/stores/cart"


const store = useCartStore()
const { toggleCartView, resetCartView, getCart } = store
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

		const { type } = parsed
		if (type === "REJECT CART") await router.push("/v2/shopping/rejected")
		else if (type === "ACCEPT CART") await router.push("/v2/shopping/accepted")

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
