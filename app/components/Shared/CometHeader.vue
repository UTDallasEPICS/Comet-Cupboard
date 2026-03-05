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
					:icon="icons['hamburger']"
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
				v-if="!isEmptyObject(inventoryStore.quantityChanges)"
				v-model:open="reviewChangesView"
				side="right"
				title="Preview Inventory Changes"
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
				<UChip :show="showQuantityItemsChanged" :text="quantityItemsChanged" size="3xl">
					<UButton variant="ghost" :icon="icons['inventory']" class="hover:bg-transparent focus-visible:ring-0 active:bg-transparent" />
				</UChip>
				<template #body>
					<InventoryReviewChangesDrawer />
				</template>
			</USlideover>
			<USlideover
				v-if="cart"
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
			<UButton v-if="canStudentAccess" variant="outline" :icon="icons['logout']" size="xl" @click="logout" />
		</template>
	</UHeader>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui"

const cartStore = useCartStore()
const inventoryStore = useInventoryStore()
const permissions = usePermissionsStore()
const { cart, cartView, cartTotalCount } = storeToRefs(cartStore)
const { canStudentAccess, canVolunteerAccess, canAdminAccess } = storeToRefs(permissions)
const { reviewChangesView, quantityItemsChanged } = storeToRefs(inventoryStore)
const showQuantityItemsChanged = computed(() => quantityItemsChanged.value > 0)

const { logout } = useLogout()
const { roleLinks } = useNavigationLinks()

const items = ref<NavigationMenuItem[]>(
	[
		// Student Group
		canStudentAccess.value && {
			label: "Student",
			icon: icons["student"],
			open: true,
			children: [...roleLinks["student"]],
		},

		// Volunteer Group
		canVolunteerAccess.value && {
			label: "Volunteer",
			icon: icons["volunteer"],
			open: true,
			children: [...roleLinks["volunteer"]],
		},

		// Admin Group
		canAdminAccess.value && {
			label: "Admin",
			icon: icons["admin"],
			open: true,
			children: roleLinks["admin"].map((item) => ({
				...item,
				open: true,
			})),
		},
	].filter(Boolean) as NavigationMenuItem[]
) // filter out nulls
</script>
