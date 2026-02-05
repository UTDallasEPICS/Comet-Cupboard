<template>
	<UHeader
		class="bg-utd-green"
		:toggle="false"
		:ui="{
			container: 'mx-0 w-full max-w-none',
		}"
	>
		<template #left>
			<USlideover
				v-if="permissions['PUBLIC']"
				side="left"
				:ui="{
					close: 'start-4',
				}"
				:close="{
					size: 'xl',
				}"
			>
				<UButton
					variant="ghost"
					size="xl"
					icon="ci:hamburger-lg"
					:ui="{
						leadingIcon: 'size-8',
					}"
					
				/>
				<template #body>
					<div v-if="permissions['SHOPPING']">
						<ULink :to="shoppingPath">Shopping</ULink>
						<USeparator />
					</div>

					<div v-if="permissions['VERIFY_CART']">
						<ULink :to="verifyPath">Verify Carts</ULink>
						<USeparator />
					</div>

					<div v-if="permissions['INVENTORY_MANAGEMENT']">
						<ULink :to="inventoryPath">Inventory Management</ULink>
						<USeparator />
					</div>

					<div v-if="permissions['PUBLIC']">
						<ULink :to="queuePath">Queue</ULink>
						<USeparator />
					</div>

					<div v-if="permissions['ADMIN']">
						<ULink :to="dataPath">Data</ULink>
						<USeparator />
					</div>

					<div v-if="permissions['ADMIN']">
						<ULink :to="sourcePath">Manage Sources</ULink>
						<USeparator />
					</div>

					<div v-if="permissions['ADMIN']">
						<ULink :to="volunteerPath">Manage Volunteers</ULink>
						<USeparator />
					</div>
				</template>
			</USlideover>
			<div class="relative ml-4 overflow-hidden">
				<img src="/CometCupboardLogo1.png" class="h-10" />
			</div>
		</template>

		<template #right>
			<UButton v-if="permissions['PUBLIC']" variant="outline" icon="ci:log-out" size="xl" @click="logout" />
		</template>
	</UHeader>
</template>

<script lang="ts" setup>
import { useCartStore } from "~/stores/cart"

const { toggleCartView } = useCartStore()

const shoppingPath = "/v2/shopping"
const verifyPath = "/v2/verify-cart"
const inventoryPath = "/v2/inventory/category-select"
const dataPath = "/v2/data-analytics"
const sourcePath = "/v2/admin/source"
const volunteerPath = "/v2/admin/volunteer"
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
