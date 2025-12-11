<template lang="pug">
div.relative.z-40
	// Top nav bar rectangle
	div(class="min-w-[300px]").bg-utd-green.w-full.h-20.flex.items-center.px-4
		// Hamburger button and comet cupboard image
		div(v-if="permissions['PUBLIC']").flex.items-center.justify-start.pt-2
			Menu(as="div" v-slot="{ close }").relative
				MenuButton.my-auto.remove-button-effects
					Bars3Icon.size-11.fill-white.stroke-white.cursor-pointer.hover_fill-utd-orange.hover_stroke-utd-orange
				TransitionsDropDown
					MenuItems(class="h-[calc(100vh-80px)]").z-50.-left-4.flex.flex-col.items-center.text-center.absolute.top-20.w-screen.sm_w-80.text-2xl.bg-white.gap-4.p-4.-mt-5
						MenuItem(v-if="permissions['SHOPPING']" as="div").w-full
							NuxtLink(@click.native="close" :to="shoppingPath").cursor-pointer.hover_underline
								| Shopping
							hr(class="border-[1.3px]").w-full.mt-4
						MenuItem(v-if="permissions['VERIFY_CART']" as="div").w-full
							NuxtLink(@click.native="close" :to="verifyPath").cursor-pointer.hover_underline
								| Verify Carts
							hr(class="border-[1.3px]").w-full.mt-4
						MenuItem(v-if="permissions['INVENTORY_MANAGEMENT']" as="div").w-full
							NuxtLink(@click.native="close" :to="inventoryPath").cursor-pointer.hover_underline
								| Inventory Management
							hr(class="border-[1.3px]").w-full.mt-4
						MenuItem(as="div").w-full
							NuxtLink(@click.native="close" :to="queuePath").cursor-pointer.hover_underline
								| Queue
							hr(class="border-[1.3px]").w-full.mt-4
						MenuItem(v-if="permissions['ADMIN']" as="div").w-full
							NuxtLink(@click.native="close" :to="dataPath").cursor-pointer.hover_underline
								| Data
							hr(class="border-[1.3px]").w-full.mt-4
						MenuItem(v-if="permissions['ADMIN']" as="div").w-full
							NuxtLink(@click.native="close" :to="sourcePath").cursor-pointer.hover_underline
								| Manage Sources
							hr(class="border-[1.3px]").w-full.mt-4
						MenuItem(v-if="permissions['ADMIN']" as="div").w-full
							NuxtLink(@click.native="close" :to="volunteerPath").cursor-pointer.hover_underline
								| Manage Volunteers
							hr(class="border-[1.3px]").w-full.mt-4
		// Comet Cupboard Logo
		div.relative.overflow-hidden.ml-4
			img(src="/CometCupboardLogo1.png").h-10
		div.ml-auto
			button(v-if="page === shoppingPath" style="text-decoration-color: white" @click="toggleCartView").relative.remove-button-effects
				ShoppingCartIcon.size-11.min-w-10.fill-white.justify-self-right.hover_fill-utd-orange
				span(v-if="cartTotalCount != 0").px-2.text-xl.absolute.font-bold.-top-2.rounded-full.-right-2.text-xl.text-white.bg-utd-orange {{ cartTotalCount }}

			// for now this is a link to the sign in page (test + nowhere else yet)
			button(v-if="permissions['PUBLIC']" @click="logout").remove-button-effects.ml-4
				ArrowRightStartOnRectangleIcon.size-10.min-w-10.fill-white.hover_fill-utd-orange
</template>

<script lang="ts" setup>
import { Bars3Icon, ShoppingCartIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/vue/24/solid"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
import { useCartStore } from "~/stores/cart"

const { toggleCartView } = useCartStore()

// Path to the shopping page
const shoppingPath = "/shopping"
// Path to the verify carts page
const verifyPath = "/verify-cart"
// Path to the inventory management page
const inventoryPath = "/v2/inventory/category-select"
// Path to the data analyzation page
const dataPath = "/data"
// Path to the admin dashboard source page
const sourcePath = "/v2/admin/source"
// Path to the admin dashboard volunteer page
const volunteerPath = "/v2/admin/volunteer"
// Path to the queue page
const queuePath = "/v2/queue"

// Auto title based on the route
const accessCookie = ref(useCookie("AccessPermission"))
const permissions = ref(accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {})
const route = useRoute()
const page = ref(route.fullPath)

watch(route, () => {
	page.value = route.fullPath
})

const logout = async () => {
	try {
		await $fetch("/api/cart/cart", {
			method: "DELETE",
		})
	} catch (err) {
		// We don't care about this error, we just don't want this to stop us though
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
