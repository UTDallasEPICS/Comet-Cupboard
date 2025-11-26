<template lang="pug">
div.relative.z-40
    // Ellipse background for the navbar
    div.relative.h-44.w-full(class="min-w-[500px]")
        div.absolute.top-0.left-0.w-full.h-full.bg-utd-green(:style="clipStyle")
        // Content layer for header title and hamburger button
        div.absolute.top-0.left-0.w-full.h-full.flex.flex-col.justify-between.z-10
            // Hamburger button and comet cupboard image
            div.flex.items-center.justify-start.px-4.pt-4 
                Menu(as="div" v-slot="{ close }").relative
                    MenuButton
                        Bars3Icon.size-11.fill-white.stroke-white.cursor-pointer.hover_fill-utd-orange.hover_stroke-utd-orange
                    TransitionsDropDown 
                        MenuItems(
                            class="h-[calc(100vh-80px)]"
				        ).z-50.-left-4.flex.flex-col.items-center.text-center.absolute.w-screen.text-2xl.bg-white.gap-4.p-4
                            MenuItem(as="div").w-full
                                NuxtLink(@click.native="close" :to="shoppingPath").cursor-pointer.hover_underline.text-cupboardv2-dg
                                    | Shopping
                                hr.w-full.mt-4(class="border-[1.3px]")
                            MenuItem(as="div").w-full
                                NuxtLink(@click.native="close" :to="verifyPath").cursor-pointer.hover_underline.text-cupboardv2-dg
                                    | Verify Carts
                                hr.w-full.mt-4(class="border-[1.3px]")
                            MenuItem(as="div").w-full
                                NuxtLink(@click.native="close" :to="inventoryPath").cursor-pointer.hover_underline.text-cupboardv2-dg
                                    | Inventory Management
                                hr.w-full.mt-4(class="border-[1.3px]")
                            MenuItem(as="div").w-full
                                NuxtLink(@click.native="close" :to="queuePath").cursor-pointer.hover_underline.text-cupboardv2-dg
                                    | Queue
                                hr.w-full.mt-4(class="border-[1.3px]")
                            MenuItem(as="div").w-full
                                NuxtLink(@click.native="close" :to="dataPath").cursor-pointer.hover_underline.text-cupboardv2-dg
                                    | Data
                                hr.w-full.mt-4(class="border-[1.3px]")
                            MenuItem(as="div").w-full
                                NuxtLink(@click.native="close" :to="adminDashboardPath").cursor-pointer.hover_underline.text-cupboardv2-dg
                                    | Admin Dashboard
                                hr.w-full.mt-4(class="border-[1.3px]")
                // Comet Cupboard Logo
                div.relative.overflow-hidden.ml-4
                    img(src="/CometCupboardLogo1.png").h-10
                div.ml-auto
                    button(v-if="page === shoppingPath" style="text-decoration-color: white" @click="toggleCartView").relative.remove-button-effects
                        ShoppingCartIcon.size-11.min-w-10.fill-white.justify-self-right.hover_fill-utd-orange
                        span(v-if="cartTotalCount != 0").px-2.text-xl.absolute.font-bold.-top-2.rounded-full.-right-2.text-xl.text-white.bg-utd-orange {{ cartTotalCount }}

                    // for now this is a link to the sign in page (test + nowhere else yet)
                    button(@click="logout").remove-button-effects.ml-4
                        ArrowRightStartOnRectangleIcon.size-10.min-w-10.fill-white.hover_fill-utd-orange

            // Title
            div.flex.justify-center.pb-8 
                p.text-3xl.font-bold.text-white {{ pageTitle }}
</template>

<script lang="ts" setup>
import { Bars3Icon, ShoppingCartIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/vue/24/solid'
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
import { useCartStore } from "~/stores/cart"

const { toggleCartView } = useCartStore()

// Creates a diagonal line styling with specified percentages to adjust the angle
const clipStyle = 'clip-path: ellipse(60% 100% at 50% 0%)'

// Path to the shopping page
const shoppingPath = "/shopping"
// Path to the verify carts page
const verifyPath = "/verify-cart"
// Path to the inventory management page
const inventoryPath = "/v2/inventory/category-select"
// Path to the data analyzation page
const dataPath = "/data"
// Path to the admin dashboard page
const adminDashboardPath = "/admin-dashboard"
// Path to the queue page
const queuePath = "/queue"

// Auto title based on the route
const route = useRoute()
const page = ref(route.fullPath)
const accessCookie = ref(useCookie("AccessPermission"))
const permissions = ref(accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {})
const pageTitle = computed(() => {
    const currentCategory = route.params.categoryName as string
    if(route.path.includes(currentCategory)) return currentCategory
    // Accounts for refreshes on titles with multiple words so the title doesn't disappear
    if(currentCategory) {
        const encodedCategory = encodeURIComponent(currentCategory)
        if(route.path.includes(encodedCategory)) {
            return currentCategory
        }
    }
    if(route.path.includes("category-select")) return "Categories"
    // Default fallback
    return ""
})

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
