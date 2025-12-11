<template lang="pug">
div.sticky.top-0.z-50.bg-utd-green
	div.h-20.flex.flex-row.items-center.px-4.gap-x-4
		// Hamburger menu
		Menu(as="div" v-slot="{ close }").h-full.relative.flex
			MenuButton.my-auto.remove-button-effects
				Bars3Icon.size-11.fill-white.stroke-white.cursor-pointer.hover_fill-utd-orange.hover_stroke-utd-orange
			TransitionsDropDown
				MenuItems(
					class="h-[calc(100vh-80px)]"
				).z-50.-left-4.flex.flex-col.items-center.text-center.absolute.top-20.w-screen.sm_w-80.border-black.border-r-2.text-2xl.bg-white.gap-4.p-4
					MenuItem(v-if="permissions['SHOPPING']" as="div").w-full
						NuxtLink(@click.native="close" :to="shoppingPath").cursor-pointer.hover_underline | Shopping
						hr.border-black.w-full.mt-4
					MenuItem(v-if="permissions['VERIFY_CART']" as="div").w-full
						NuxtLink(@click.native="close" :to="verifyPath").cursor-pointer.hover_underline | Verify Carts
						hr.border-black.w-full.mt-4
					MenuItem(v-if="permissions['INVENTORY_MANAGEMENT']" as="div").w-full
						NuxtLink(@click.native="close" :to="inventoryPath").cursor-pointer.hover_underline | Inventory Management
						hr.border-black.w-full.mt-4
					MenuItem(v-if="permissions['PUBLIC']" as="div").w-full
						NuxtLink(@click.native="close" :to="queuePath").cursor-pointer.hover_underline | Queue
						hr.border-black.w-full.mt-4
					MenuItem(v-if="permissions['ADMIN']" as="div").w-full
						NuxtLink(@click.native="close" :to="dataPath").cursor-pointer.hover_underline | Data
						hr.border-black.w-full.mt-4
					MenuItem(v-if="permissions['ADMIN']" as="div").w-full
						NuxtLink(@click.native="close" :to="adminDashboardPath").cursor-pointer.hover_underline | Admin Dashboard
						hr.border-black.w-full.mt-4

		// Logo
		img(src="/CometCupboardLogo1.png").h-14

		// Header right
		div.ml-auto.flex.items-center.gap-4
			// Unified cart icon
			CartIconAnimate ref="cartIcon"

			// Logout button
			//button(@click="logout").remove-button-effects
			//ArrowRightStartOnRectangleIcon.size-10.min-w-10.fill-white.hover_fill-utd-orange
</template>

<script lang="ts" setup>
import { Bars3Icon, ArrowRightStartOnRectangleIcon } from "@heroicons/vue/24/solid"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
import { useCartStore } from "~/stores/cart"

const store = useCartStore()

// Permissions
const accessCookie = ref(useCookie("AccessPermission"))
const permissions = ref(accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {})

// Routing
const route = useRoute()
const page = ref(route.fullPath)

// get the route to check if the user is on the shopping page
watch(route, () => {
	page.value = route.fullPath
})

// Paths
const shoppingPath = "/shopping"
const verifyPath = "/verify-cart"
const inventoryPath = "/v2/inventory/category-select"
const dataPath = "/data"
const adminDashboardPath = "/admin-dashboard"
const queuePath = "/queue"

// Logout
const logout = async () => {
	try {
		await $fetch("/api/cart/cart", { method: "DELETE" })
	} catch {}
	try {
		await $fetch("/api/queue", { method: "DELETE", body: { netID: useCookie("netID").value } })
	} catch {}

	useCookie("netID").value = null
	accessCookie.value = null
	permissions.value = {}

	await navigateTo("/")
}
</script>
