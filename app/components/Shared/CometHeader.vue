<template>
	<UHeader
		class="bg-final-utd-green"
		:toggle="false"
		:ui="{
			container: 'mx-0 w-full max-w-none',
			root: 'border-b-0',
		}"
	>
		<template #left>
			<USlideover
				v-if="true"
				side="left"
				title="Navigation Menu"
				:overlay="false"
				:ui="{
					content: 'bg-final-page-bg',
					header: 'bg-final-utd-orange',
					title: 'text-white',
					close: 'text-white hover:bg-transparent hover:text-black focus-visible:bg-transparent focus-visible:text-black focus-visible:ring-0 active:bg-transparent',
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
					<UNavigationMenu :items="items" orientation="vertical" class="w-full" />
					<!-- <div v-if="permissions['SHOPPING']">
						<ULink :to="shoppingPath" class="">Shopping</ULink>
						<USeparator :ui="{ border: 'border-black' }" />
					</div>

					<div v-if="permissions['VERIFY_CART']">
						<ULink :to="verifyPath" class="">Verify Carts</ULink>
						<USeparator :ui="{ border: 'border-black' }" />
					</div>

					<div v-if="permissions['INVENTORY_MANAGEMENT']">
						<ULink :to="inventoryPath" class="">Inventory Management</ULink>
						<USeparator :ui="{ border: 'border-black' }" />
					</div>

					<div v-if="permissions['PUBLIC']">
						<ULink :to="queuePath" class="">Queue</ULink>
						<USeparator :ui="{ border: 'border-black' }" />
					</div>

					<div v-if="permissions['ADMIN']">
						<ULink :to="dataPath" class="">Data</ULink>
						<USeparator :ui="{ border: 'border-black' }" />
					</div>

					<div v-if="permissions['ADMIN']">
						<ULink :to="sourcePath" class="">Manage Sources</ULink>
						<USeparator :ui="{ border: 'border-black' }" />
					</div>

					<div v-if="permissions['ADMIN']">
						<ULink :to="volunteerPath" class="">Manage Volunteers</ULink>
						<USeparator :ui="{ border: 'border-black' }" />
					</div> -->
				</template>
			</USlideover>
			<div class="relative ml-4 overflow-hidden">
				<img src="/CometCupboardLogo1.png" class="h-10" />
			</div>
		</template>

		<template #right>
			<USlideover
				v-if="true"
				v-model:open="cartView"
				side="right"
				title="Preview Cart"
				:overlay="false"
				:ui="{
					content: 'max-w-112 mt-16 bg-final-page-bg',
					header: 'bg-final-utd-orange',
					title: 'text-white',
					close: 'text-white hover:bg-transparent hover:text-black focus-visible:bg-transparent focus-visible:text-black focus-visible:ring-0 active:bg-transparent',
				}"
				:close="{
					size: 'xl',
				}"
			>
				<UButton variant="ghost" class="hover:bg-transparent focus-visible:ring-0 active:bg-transparent">
					<ShoppingCartIcon :cart-view="cartView" :cart-disabled="false" :cart-total-count="cartTotalCount" />
				</UButton>
				<template #body>
					<ShoppingCartDrawer />
				</template>
			</USlideover>
			<UButton v-if="true" variant="outline" icon="ci:log-out" size="xl" @click="logout" />
		</template>
	</UHeader>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui"

interface Permissions {
	SHOPPING?: boolean
	VERIFY_CART?: boolean
	INVENTORY_MANAGEMENT?: boolean
	PUBLIC?: boolean
	ADMIN?: boolean
}

const store = useCartStore()
const { cartView, cartTotalCount } = storeToRefs(store)
const { logout } = useLogout()

const studentDashboardPath = "/landing/student"
const volunteerDashboardPath = "/landing/volunteer"
const adminDashboardPath = "/landing/admin"
const shoppingPath = "/shopping"
const verifyPath = "/verify-cart"
const inventoryPath = "/inventory"
const dataPath = "/data-analytics"
const sourcePath = "/admin/source"
const volunteerPath = "/admin/volunteer"
const queuePath = "/queue"

const accessCookie = ref(useCookie("AccessPermission"))

const permissions = {
	STUDENT: true,
	VOLUNTEER: true,
	ADMIN: true,
}

const items = ref<NavigationMenuItem[]>(
	[
		// Student Group
		permissions.STUDENT && {
			label: "Student",
			icon: "i-lucide-user",
			open: true,
			children: [
				{ label: "Dashboard", to: studentDashboardPath, icon: "i-lucide-home" },
				{ label: "Shopping", to: shoppingPath, icon: "i-lucide-shopping-cart" },
				{ label: "Queue", to: queuePath, icon: "i-lucide-clock" },
			],
		},

		// Volunteer Group
		permissions.VOLUNTEER && {
			label: "Volunteer",
			icon: "i-lucide-users",
			open: true,
			children: [
				{ label: "Dashboard", to: volunteerDashboardPath, icon: "i-lucide-home" },
				{ label: "Inventory Management", to: inventoryPath, icon: "i-lucide-box" },
				{ label: "Verify Cart", to: verifyPath, icon: "i-lucide-check-circle" },
				{ label: "Queue", to: queuePath, icon: "i-lucide-clock" },
			],
		},

		// Admin Group
		permissions.ADMIN && {
			label: "Admin",
			icon: "i-lucide-shield",
			open: true,
			children: [
				{ label: "Dashboard", to: adminDashboardPath, icon: "i-lucide-home" },
				{ label: "Data Page", to: dataPath, icon: "i-lucide-database" },
				{
					label: "Management",
					icon: "i-lucide-settings",
					open: true,
					children: [
						{ label: "Volunteers", to: volunteerPath, icon: "i-lucide-user" },
						{ label: "Sources", to: sourcePath, icon: "i-lucide-box" },
					],
				},
			],
		},
	].filter(Boolean) as NavigationMenuItem[]
) // filter out nulls
</script>
