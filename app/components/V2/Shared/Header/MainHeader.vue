<template>
	<!-- Top nav bar rectangle -->
	<div class="bg-utd-green flex h-20 w-full min-w-[300px] items-center px-4">
		<!-- Hamburger button and comet cupboard image -->
		<div v-if="permissions['PUBLIC']" class="flex items-center justify-start pt-2">
			<Menu as="div" class="relative" v-slot="{ close }">
				<MenuButton class="remove-button-effects my-auto">
					<Bars3Icon class="hover:fill-utd-orange hover:stroke-utd-orange size-11 cursor-pointer fill-white stroke-white" />
				</MenuButton>
				<TransitionsDropDown>
					<MenuItems
						class="sm:w-80 absolute top-20 -left-4 z-50 -mt-5 flex h-[calc(100vh-80px)] w-screen flex-col items-center gap-4 bg-white p-4 text-center text-2xl"
					>
						<MenuItem v-if="permissions['SHOPPING']" as="div" class="w-full">
							<NuxtLink @click.native="close" :to="shoppingPath" class="hover:underline cursor-pointer">Shopping</NuxtLink>
							<hr class="mt-4 w-full border-[1.3px]" />
						</MenuItem>
						<MenuItem v-if="permissions['VERIFY_CART']" as="div" class="w-full">
							<NuxtLink @click.native="close" :to="verifyPath" class="hover:underline cursor-pointer">Verify Carts</NuxtLink>
							<hr class="mt-4 w-full border-[1.3px]" />
						</MenuItem>
						<MenuItem v-if="permissions['INVENTORY_MANAGEMENT']" as="div" class="w-full">
							<NuxtLink @click.native="close" :to="inventoryPath" class="hover:underline cursor-pointer">Inventory Management</NuxtLink>
							<hr class="mt-4 w-full border-[1.3px]" />
						</MenuItem>
						<MenuItem as="div" class="w-full">
							<NuxtLink @click.native="close" :to="queuePath" class="hover:underline cursor-pointer">Queue</NuxtLink>
							<hr class="mt-4 w-full border-[1.3px]" />
						</MenuItem>
						<MenuItem v-if="permissions['ADMIN']" as="div" class="w-full">
							<NuxtLink @click.native="close" :to="dataPath" class="hover:underline cursor-pointer">Data</NuxtLink>
							<hr class="mt-4 w-full border-[1.3px]" />
						</MenuItem>
						<MenuItem v-if="permissions['ADMIN']" as="div" class="w-full">
							<NuxtLink @click.native="close" :to="sourcePath" class="hover:underline cursor-pointer">Manage Sources</NuxtLink>
							<hr class="mt-4 w-full border-[1.3px]" />
						</MenuItem>
						<MenuItem v-if="permissions['ADMIN']" as="div" class="w-full">
							<NuxtLink @click.native="close" :to="volunteerPath" class="hover:underline cursor-pointer">Manage Volunteers</NuxtLink>
							<hr class="mt-4 w-full border-[1.3px]" />
						</MenuItem>
					</MenuItems>
				</TransitionsDropDown>
			</Menu>
		</div>
		<!-- Comet Cupboard Logo -->
		<div class="relative ml-4 overflow-hidden">
			<img src="/CometCupboardLogo1.png" class="h-10" />
		</div>
		<div class="ml-auto flex h-full flex-row">
			<div v-if="page.includes('shopping')" class="relative">
				<V2ShoppingCartIconAnimate class="justify-self-right hover:fill-utd-orange size-11 min-w-10 fill-white" />
				<!-- <span v-if="cartTotalCount != 0" class="px-2 text-xl absolute font-bold -top-2 rounded-full -right-2 text-xl text-white bg-utd-orange">{{ cartTotalCount }}</span> -->
			</div>
			<!-- for now this is a link to the sign in page (test + nowhere else yet) -->
			<button v-if="permissions['PUBLIC']" @click="logout" class="remove-button-effects ml-4">
				<ArrowRightStartOnRectangleIcon class="hover:fill-utd-orange size-10 min-w-10 fill-white" />
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Bars3Icon, ShoppingCartIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/vue/24/solid"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
import { useCartStore } from "~/stores/cart"

const { toggleCartView } = useCartStore()

// Path to the shopping page
const shoppingPath = "/v2/shopping"
// Path to the verify carts page
const verifyPath = "/v2/verify-cart"
// Path to the inventory management page
const inventoryPath = "/v2/inventory/category-select"
// Path to the data analyzation page
const dataPath = "/v2/data-analytics"
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
