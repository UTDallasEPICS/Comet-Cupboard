<template lang="pug">
div.sticky.top-0.z-50
	div.h-20.bg-utd-green.flex.flex-row.flex-nowrap.items-center
		Menu(as="div").h-full.relative
			MenuButton
				Bars3Icon.size-11.fill-white.stroke-white.cursor-pointer
			MenuItems.flex.absolute.left-0.top-20.flex-col
				MenuItem
					NuxtLink(:to="shoppingPath").cursor-pointer
						| Shopping
				MenuItem
					NuxtLink(:to="shoppingPath").cursor-pointer
						| Shopping

			//- 	div(v-if="permissions['SHOPPING']").flex.justify-center.text-3xl.font-medium
			//- 	NuxtLink(@click="mobileNav = false" :to="shoppingPath").cursor-pointer
			//- 		| Shopping
			//- div(v-if="permissions['VERIFY_CART']").flex.flex-col.place-items-center
			//- 	div(class="h-[1px] w-9/12").bg-white.my-6
			//- 	div.flex.justify-center.text-3xl.font-medium
			//- 		NuxtLink(@click="mobileNav = false" :to="verifyPath").cursor-pointer
			//- 			| Verify Carts
			//- div(v-if="permissions['INVENTORY_MANAGEMENT']").flex.flex-col.place-items-center
			//- 	div(class="h-[1px] w-9/12").bg-white.my-6
			//- 	div.flex.justify-center.text-3xl.font-medium
			//- 		NuxtLink(@click="mobileNav = false" :to="inventoryPath").cursor-pointer
			//- 			| Inventory Management
			//- div(v-if="permissions['ADMIN']").flex.flex-col.place-items-center
			//- 	div(class="h-[1px] w-9/12").bg-white.my-6
			//- 	div.flex.justify-center.text-3xl.font-medium
			//- 		NuxtLink(@click="mobileNav = false" :to="dataPath").cursor-pointer
			//- 			| Data
			//- div(v-if="permissions['ADMIN']").flex.flex-col.place-items-center
			//- 	div(class="h-[1px] w-9/12").bg-white.my-6
			//- 	div.flex.justify-center.text-3xl.font-medium
			//- 		NuxtLink(@click="mobileNav = false" :to="adminDashboardPath").cursor-pointer
			//- 			| Admin Dashboard

		//- img(src="/CometCupboardLogo1.png").h-14
		//- div.flex.flex-row.space-x-1.tn_space-x-2.sm_space-x-4.ml-auto
		//- 	button(v-if="page === shoppingPath" style="text-decoration-color: white" @click="toggleCartView").relative
		//- 		ShoppingCartIcon.size-11.min-w-10.fill-white.justify-self-right.hover_fill-utd-orange
		//- 		span(v-if="cartTotalCount != 0").px-2.text-xl.absolute.font-bold.-top-2.rounded-full.-right-2.text-xl.text-white.bg-utd-orange {{ cartTotalCount }}
		//- 	// for now this is a link to the sign in page (test + nowhere else yet)
		//- 	button(@click="logout").cursor-pointer
		//- 		ArrowRightStartOnRectangleIcon.size-10.min-w-10.fill-white.justify-self-right.hover_fill-utd-orange
		//- div.mx-2.tn_mx-4.sm_mx-8.flex.flex-row
		//- 	div(@click="mobileNav = !mobileNav").place-self-center.pr-2.tn_pr-4.sm_pr-4
		//- 		Bars3Icon.size-11.fill-white.stroke-white.cursor-pointer
		//- 	div.flex.flex-row.h-14.items-center.w-full
		//- 		img(src="/CometCupboardLogo1.png").h-14
		//- 		div.flex.flex-row.space-x-1.tn_space-x-2.sm_space-x-4.ml-auto
		//- 			button(v-if="page === shoppingPath" style="text-decoration-color: white" @click="toggleCartView").relative
		//- 				ShoppingCartIcon.size-11.min-w-10.fill-white.justify-self-right.hover_fill-utd-orange
		//- 				span(v-if="cartTotalCount != 0").px-2.text-xl.absolute.font-bold.-top-2.rounded-full.-right-2.text-xl.text-white.bg-utd-orange {{ cartTotalCount }}

		//- 			// for now this is a link to the sign in page (test + nowhere else yet)
		//- 			button(@click="logout").cursor-pointer
		//- 				ArrowRightStartOnRectangleIcon.size-10.min-w-10.fill-white.justify-self-right.hover_fill-utd-orange
	//- // mobile navigation menu 
	//- div(v-show="mobileNav").z-40.flex-grow.h-screen.w-screen.bg-utd-green
	//- 	div.h-1.w-full.bg-white
	//- 	div.relative.h-20.w-full.bg-utd-orange.content-center
	//- 		div.text-3xl.text-center.font-bold.text-white
	//- 			| Navigation
	//- 		button(@click="mobileNav = false").absolute.inset-y-0.right-5
	//- 			XMarkIcon.size-10.fill-white.stroke-white.hover_fill-black.hover_stroke-black
	//- 	div.h-1.w-full.overflow-y-clip.overscroll-none.bg-white
	//- 	div.mt-6.flex.flex-col.text-white
	//- 		div(v-if="permissions['SHOPPING']").flex.justify-center.text-3xl.font-medium
	//- 			NuxtLink(@click="mobileNav = false" :to="shoppingPath").cursor-pointer
	//- 				| Shopping
	//- 		div(v-if="permissions['VERIFY_CART']").flex.flex-col.place-items-center
	//- 			div(class="h-[1px] w-9/12").bg-white.my-6
	//- 			div.flex.justify-center.text-3xl.font-medium
	//- 				NuxtLink(@click="mobileNav = false" :to="verifyPath").cursor-pointer
	//- 					| Verify Carts
	//- 		div(v-if="permissions['INVENTORY_MANAGEMENT']").flex.flex-col.place-items-center
	//- 			div(class="h-[1px] w-9/12").bg-white.my-6
	//- 			div.flex.justify-center.text-3xl.font-medium
	//- 				NuxtLink(@click="mobileNav = false" :to="inventoryPath").cursor-pointer
	//- 					| Inventory Management
	//- 		div(v-if="permissions['ADMIN']").flex.flex-col.place-items-center
	//- 			div(class="h-[1px] w-9/12").bg-white.my-6
	//- 			div.flex.justify-center.text-3xl.font-medium
	//- 				NuxtLink(@click="mobileNav = false" :to="dataPath").cursor-pointer
	//- 					| Data
	//- 		div(v-if="permissions['ADMIN']").flex.flex-col.place-items-center
	//- 			div(class="h-[1px] w-9/12").bg-white.my-6
	//- 			div.flex.justify-center.text-3xl.font-medium
	//- 				NuxtLink(@click="mobileNav = false" :to="adminDashboardPath").cursor-pointer
	//- 					| Admin Dashboard
</template>

<script lang="ts" setup>
import { Bars3Icon, ShoppingCartIcon, ArrowRightStartOnRectangleIcon, XMarkIcon } from "@heroicons/vue/24/solid"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
import { useCartStore } from "~/stores/cart"
import { storeToRefs } from "pinia"

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
const inventoryPath = "/inventory-management"
// path to the data analyzation page
const dataPath = "/data"
// path to the admin dashboard page
const adminDashboardPath = "/admin-dashboard"

// get the route to check if the user is on the shopping page
watch(route, () => {
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

const store = useCartStore()
const { cartTotalCount } = storeToRefs(store)
</script>
