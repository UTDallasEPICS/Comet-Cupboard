<template lang="pug">
div.sticky.top-0.z-50
	div.h-20.bg-utd-green.flex.flex-row.flex-nowrap.items-center.px-4.gap-x-4
		Menu(as="div" v-slot="{ close }").h-full.relative.flex
			MenuButton.my-auto.remove-button-effects
				Bars3Icon.size-11.fill-white.stroke-white.cursor-pointer.hover_fill-utd-orange.hover_stroke-utd-orange
			TransitionsDropDown
				MenuItems(
					class="h-[calc(100vh-80px)]"
				).z-50.-left-4.flex.flex-col.items-center.text-center.absolute.top-20.w-screen.sm_w-80.text-2xl.bg-white.gap-4.p-4
					MenuItem(v-if="permissions['SHOPPING']" as="div").w-full
						NuxtLink(@click.native="close" :to="shoppingPath").cursor-pointer.hover_underline.text-cupboardv2-dg
							| Shopping
						hr.w-full.mt-4(class="border-[1.3px]")
					MenuItem(v-if="permissions['VERIFY_CART']" as="div").w-full
						NuxtLink(@click.native="close" :to="verifyPath").cursor-pointer.hover_underline.text-cupboardv2-dg
							| Verify Carts
						hr.w-full.mt-4(class="border-[1.3px]")
					MenuItem(v-if="permissions['INVENTORY_MANAGEMENT']" as="div").w-full
						NuxtLink(@click.native="close" :to="inventoryPath").cursor-pointer.hover_underline.text-cupboardv2-dg
							| Inventory Management
						hr.w-full.mt-4(class="border-[1.3px]")
					MenuItem(v-if="permissions['PUBLIC']" as="div").w-full
						NuxtLink(@click.native="close" :to="queuePath").cursor-pointer.hover_underline.text-cupboardv2-dg
							| Queue
						hr.w-full.mt-4(class="border-[1.3px]")
					MenuItem(v-if="permissions['ADMIN']" as="div").w-full
						NuxtLink(@click.native="close" :to="dataPath").cursor-pointer.hover_underline.text-cupboardv2-dg
							| Data
						hr.w-full.mt-4(class="border-[1.3px]")
					MenuItem(v-if="permissions['ADMIN']" as="div").w-full
						NuxtLink(@click.native="close" :to="adminDashboardPath").cursor-pointer.hover_underline.text-cupboardv2-dg
							| Admin Dashboard
						hr.w-full.mt-4(class="border-[1.3px]")
		img(src="/CometCupboardLogo1.png").h-14
		div.ml-auto
			button(v-if="page === shoppingPath" style="text-decoration-color: white" @click="toggleCartView").relative.remove-button-effects
				ShoppingCartIcon.size-11.min-w-10.fill-white.justify-self-right.hover_fill-utd-orange
				span(v-if="cartTotalCount != 0").px-2.text-xl.absolute.font-bold.-top-2.rounded-full.-right-2.text-xl.text-white.bg-utd-orange {{ cartTotalCount }}

			// for now this is a link to the sign in page (test + nowhere else yet)
			button(@click="logout").remove-button-effects.ml-4
				ArrowRightStartOnRectangleIcon.size-10.min-w-10.fill-white.hover_fill-utd-orange
</template>

<script lang="ts" setup>
import { Bars3Icon, ShoppingCartIcon, ArrowRightStartOnRectangleIcon, XMarkIcon } from "@heroicons/vue/24/solid"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
import { useCartStore } from "~/stores/cart"

const { toggleCartView } = useCartStore()

const accessCookie = ref(useCookie("AccessPermission"))
const permissions = ref(accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {})
const route = useRoute()
const page = ref(route.fullPath)

// path to the shopping page
const shoppingPath = "/shopping"
// path to the verify carts page
const verifyPath = "/verify-cart"
// path to the inventory management page
const inventoryPath = "/v2/inventory/category-select"
// path to the data analyzation page
const dataPath = "/data"
// path to the admin dashboard page
const adminDashboardPath = "/admin-dashboard"
//Path to the queue page
const queuePath = "/queue"

// get the route to check if the user is on the shopping page
watch(route, () => {
	page.value = route.fullPath
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
	netIDCookie.value = null
	accessCookie.value = null
	permissions.value = accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {}

	await navigateTo("/")
}

const store = useCartStore()
const { cartTotalCount } = storeToRefs(store)
</script>
