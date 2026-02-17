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

const store = useCartStore()
const permissions = usePermissionsStore()
const { cartView, cartTotalCount } = storeToRefs(store)
const { canStudentAccess, canVolunteerAccess, canAdminAccess } = storeToRefs(permissions)
const { logout } = useLogout()

const studentDashboardPath = "/landing/student"
const volunteerDashboardPath = "/landing/volunteer"
const adminDashboardPath = "/landing/admin"
const shoppingPath = "/shopping"
const verifyPath = "/verify-cart"
const inventoryPath = "/inventory"
const dataPath = "/data-analytics"
const manageSourcePath = "/manage/source"
const manageVolunteerPath = "/manage/volunteer"
const queuePath = "/queue"
const manageQueuePath = "/queue/manage"

const items = ref<NavigationMenuItem[]>(
	[
		// Student Group
		canStudentAccess.value && {
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
		canVolunteerAccess.value && {
			label: "Volunteer",
			icon: "i-lucide-users",
			open: true,
			children: [
				{ label: "Dashboard", to: volunteerDashboardPath, icon: "i-lucide-home" },
				{ label: "Inventory Management", to: inventoryPath, icon: "i-lucide-box" },
				{ label: "Verify Cart", to: verifyPath, icon: "i-lucide-check-circle" },
				{ label: "Queue Management", to: manageQueuePath, icon: "i-lucide-clock" },
			],
		},

		// Admin Group
		canAdminAccess.value && {
			label: "Admin",
			icon: "i-lucide-shield",
			open: true,
			children: [
				{ label: "Dashboard", to: adminDashboardPath, icon: "i-lucide-home" },
				{ label: "Data Page", to: dataPath, icon: "i-heroicons-chart-bar" },
				{
					label: "Management",
					icon: "i-lucide-settings",
					open: true,
					children: [
						{ label: "Volunteers", to: manageVolunteerPath, icon: "i-lucide-users" },
						{ label: "Sources", to: manageSourcePath, icon: "i-lucide-box" },
					],
				},
			],
		},
	].filter(Boolean) as NavigationMenuItem[]
) // filter out nulls
</script>
