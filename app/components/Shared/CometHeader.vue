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
				v-if="loggedIn"
				side="left"
				:overlay="false"
				:ui="{
					content: 'bg-final-page-bg',
					header: 'bg-final-utd-orange',
				}"
			>
				<UButton variant="ghost" class="hover:bg-transparent active:bg-transparent" size="xl" :icon="icons['hamburger']" />

				<template #header="{ close }">
					<div class="flex w-full flex-row items-center justify-between">
						<img src="/CometCupboardLogo2.png" class="h-8" />
						<UButton variant="ghost" class="text-white hover:bg-transparent active:bg-transparent" :icon="icons['close']" @click="close" />
					</div>
				</template>

				<template #body>
					<UNavigationMenu :items="items" orientation="vertical" class="w-full" />
				</template>
			</USlideover>
			<div class="relative ml-2 overflow-hidden">
				<NuxtLink to="/" class="focus:outline-none">
					<img src="/CometCupboardLogo1.png" class="h-8" />
				</NuxtLink>
			</div>
		</template>

		<template #right>
			<div class="flex flex-row gap-2">
				<USlideover
					v-if="showInventoryChangesIcon"
					side="right"
					:overlay="false"
					:ui="{
						content: 'max-w-112 mt-16 bg-final-page-bg',
						header: 'bg-final-utd-orange',
					}"
				>
					<UChip
						:show="numberOfChanges > 0"
						:text="numberOfChanges"
						:ui="{
							base: 'top-2 right-2 h-[20px] min-w-[20px] text-[20px] ring-0 text-sm',
						}"
					>
						<UButton
							variant="ghost"
							:icon="icons['inventory']"
							class="text-white hover:bg-transparent focus-visible:ring-0 active:bg-transparent"
						/>
					</UChip>

					<template #header="{ close }">
						<div class="flex w-full flex-row items-center justify-between">
							<SharedTextBase class="font-semibold text-white">Inventory Changes</SharedTextBase>
							<UButton variant="ghost" class="text-white hover:bg-transparent active:bg-transparent" :icon="icons['close']" @click="close" />
						</div>
					</template>

					<template #body>
						<InventoryReviewChangesDrawer />
					</template>
				</USlideover>
				<USlideover
					v-if="showCartIcon"
					v-model:open="cartView"
					side="right"
					:overlay="false"
					:ui="{
						content: 'max-w-112 mt-16 bg-final-page-bg',
						header: 'bg-final-utd-orange',
					}"
				>
					<UButton variant="ghost" class="hover:bg-transparent focus-visible:ring-0 active:bg-transparent">
						<ShoppingCartIcon :cart-view="cartView" :cart-disabled="false" :cart-total-count="cartTotalCount" />
					</UButton>

					<template #header="{ close }">
						<div class="flex w-full flex-row items-center justify-between">
							<SharedTextBase class="font-semibold text-white">Your Cart</SharedTextBase>
							<UButton variant="ghost" class="text-white hover:bg-transparent active:bg-transparent" :icon="icons['close']" @click="close" />
						</div>
					</template>
					<template #body>
						<ShoppingCartDrawer />
					</template>
				</USlideover>
				<UPopover
					:content="{
						align: 'center',
						side: 'bottom',
						sideOffset: 8,
					}"
				>
					<UButton v-if="canStudentAccess" variant="ghost" :icon="icons['profile']" size="xl" />

					<template #content>
						<div class="flex w-64 flex-col items-start gap-2 p-4">
							<SharedTextBase>John Doe</SharedTextBase>
							<SharedTextBase>John.Doe1@utdallas.edu</SharedTextBase>
							<SharedTextBase class="text-final-utd-orange">{{ roleText }}</SharedTextBase>
							<USeparator />
							<UButton variant="outline" :icon="icons['logout']" class="w-full" @click="logout"> Logout </UButton>
						</div>
					</template>
				</UPopover>
			</div>
		</template>
	</UHeader>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui"

const cartStore = useCartStore()
const inventoryStore = useInventoryStore()
const permissions = usePermissionsStore()
const { cart, cartView, cartTotalCount } = storeToRefs(cartStore)
const { canStudentAccess, canVolunteerAccess, canAdminAccess, roleText, loggedIn } = storeToRefs(permissions)
const { inventoryChanges, numberOfChanges } = storeToRefs(inventoryStore)

const route = useRoute()
const showCartIcon = computed(() => {
	return route.path.startsWith("/student") && route.path !== "/student/shopping/checkout"
})

const showInventoryChangesIcon = computed(() => {
	return route.path.startsWith("/volunteer/inventory")
})

const { logout } = useLogout()

const items = ref<NavigationMenuItem[]>(
	[
		// Student Group
		canStudentAccess.value && {
			label: "Student",
			icon: icons["student"],
			open: true,
			children: roleLinks["student"],
		},

		// Volunteer Group
		canVolunteerAccess.value && {
			label: "Volunteer",
			icon: icons["volunteer"],
			open: true,
			children: roleLinks["volunteer"],
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
