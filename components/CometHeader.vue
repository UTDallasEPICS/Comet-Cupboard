<template lang="pug">
div.sticky.top-0.z-50
	div.min-h-20.overscroll-none.bg-utd-green.content-center
		div.mx-2.tn_mx-4.sm_mx-8.flex.flex-row
			div(@click="mobileNav = !mobileNav").sm_hidden.place-self-center.pr-2.tn_pr-4.sm_pr-4
				Bars3Icon.size-11.fill-white.stroke-white.cursor-pointer
			div.flex.flex-row.h-14.tn_space-x-5.sm_space-x-14.items-center.w-full
				img(src="/CometCupboardLogo1.png").h-14
				// desktop navigation links
				div.flex-grow.flex-row.space-x-10.overflow-x-scroll.no-scrollbar.items-center.left-left.text-3xl.font-bold.text-white.text-nowrap
					div(v-if="permissions['SHOPPING']").inline-flex(style="text-decoration-color: white").max-sm_hidden.hover_underline
						NuxtLink(:to="shoppingPath").cursor-pointer.text-nowrap
							| Shopping
					div(v-if="permissions['VERIFY_CART']").inline-flex(style="text-decoration-color: white").max-sm_hidden.hover_underline
						NuxtLink(:to="verifyPath").cursor-pointer.text-nowrap
							| Verify Carts
					div(v-if="permissions['INVENTORY_MANAGEMENT']").inline-flex(style="text-decoration-color: white").max-sm_hidden.hover_underline
						NuxtLink(:to="inventoryPath").cursor-pointer.text-nowrap
							| Inventory Management
					div(v-if="permissions['ADMIN']").inline-flex(style="text-decoration-color: white").max-sm_hidden.hover_underline
						NuxtLink(:to="dataPath").cursor-pointer.text-nowrap
							| Data
					div(v-if="permissions['ADMIN']").inline-flex.max-sm_hidden.hover_underline
						NuxtLink(:to="adminDashboardPath").cursor-pointer.text-nowrap
							| Admin Dashboard
				div.flex.flex-row.space-x-1.tn_space-x-2.sm_space-x-4
					button(v-if="page === shoppingPath" @click="cartView = !cartView").hover_underline(style="text-decoration-color: white")
						ShoppingBagIcon.size-10.min-w-10.fill-white.justify-self-right.hover_fill-utd-orange
					TransitionsSlideLeft
						CartView(v-if="cartView" @closeCartView="cartView = false").fixed.z-50.right-0.top-20.bottom-0
					// for now this is a link to the sign in page (test + nowhere else yet)
					button(@click="logout").cursor-pointer
						ArrowRightStartOnRectangleIcon.size-10.min-w-10.fill-white.justify-self-right.hover_fill-utd-orange
	// mobile navigation menu 
	div(v-show="mobileNav").z-40.flex-grow.h-screen.w-screen.bg-utd-green
		div.h-1.w-full.bg-white
		div.relative.h-20.w-full.bg-utd-orange.content-center
			div.text-3xl.text-center.font-bold.text-white
				| Navigation
			button(@click="mobileNav = false").absolute.inset-y-0.right-5
				XMarkIcon.size-10.fill-white.stroke-white.hover_fill-black.hover_stroke-black
		div.h-1.w-full.overflow-y-clip.overscroll-none.bg-white
		div.mt-6.flex.flex-col.text-white
			div(v-if="permissions['SHOPPING']").flex.justify-center.text-3xl.font-medium
				NuxtLink(@click="mobileNav = false" :to="shoppingPath").cursor-pointer
					| Shopping
			div(v-if="permissions['VERIFY_CART']").flex.flex-col.place-items-center
				div(class="h-[1px] w-9/12").bg-white.my-6
				div.flex.justify-center.text-3xl.font-medium
					NuxtLink(@click="mobileNav = false" :to="verifyPath").cursor-pointer
						| Verify Carts
			div(v-if="permissions['INVENTORY_MANAGEMENT']").flex.flex-col.place-items-center
				div(class="h-[1px] w-9/12").bg-white.my-6
				div.flex.justify-center.text-3xl.font-medium
					NuxtLink(@click="mobileNav = false" :to="inventoryPath").cursor-pointer
						| Inventory Management
			div(v-if="permissions['ADMIN']").flex.flex-col.place-items-center
				div(class="h-[1px] w-9/12").bg-white.my-6
				div.flex.justify-center.text-3xl.font-medium
					NuxtLink(@click="mobileNav = false" :to="dataPath").cursor-pointer
						| Data
			div(v-if="permissions['ADMIN']").flex.flex-col.place-items-center
				div(class="h-[1px] w-9/12").bg-white.my-6
				div.flex.justify-center.text-3xl.font-medium
					NuxtLink(@click="mobileNav = false" :to="adminDashboardPath").cursor-pointer
						| Admin Dashboard
</template>

<script lang="ts" setup>
import { Bars3Icon, ShoppingBagIcon, ArrowRightStartOnRectangleIcon, XMarkIcon } from "@heroicons/vue/24/solid"

const accessCookie = ref(useCookie("AccessPermission"))
const permissions = ref(accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {})
// flag for if the cart view is open
const cartView = ref(false)
// flag for if the mobile navigation menu is open
const mobileNav = ref(false)
const route = useRoute()
const page = ref(route.fullPath)

// path to the shopping page
const shoppingPath = "/shopping"
// path to the verify carts page
const verifyPath = "/verify-cart"
// path to the inventory management page
const inventoryPath = "/inventory-management"
// path to the data analyzation page
const dataPath = "/data"
// path to the admin dashboard page
const adminDashboardPath = "/admin-dashboard"

// get the route to check if the user is on the shopping page
watch(route, () => {
	console.log("refreshed header route")
	page.value = route.fullPath
})

const logout = async () => {
	await $fetch("/api/cart/cart", {
		method: "DELETE",
	})
	const netIDCookie = useCookie("netID")
	netIDCookie.value = null
	accessCookie.value = null
	permissions.value = accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {}

	await navigateTo("/")
}
</script>
