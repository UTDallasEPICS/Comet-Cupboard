<template>
	<UHeader
		class="bg-utd-green"
		:toggle="false"
		:ui="{
			container: 'mx-0 w-full max-w-none',
			root: 'border-b-0',
		}"
	>
		<template #left>
			<USlideover
				v-if="permissionsStore.loggedIn"
				side="left"
				:overlay="false"
				:ui="{
					content: 'bg-page-bg',
					header: 'bg-utd-orange',
				}"
				v-model:open="openNavigationMenu"
			>
				<UButton variant="ghost" class="hover:bg-transparent active:bg-transparent" size="xl" :icon="icons['hamburger']" />

				<template #header="{ close }">
					<div class="flex w-full flex-row items-center justify-between">
						<img src="/CometCupboardLogo2.png" class="aspect-auto h-8" />
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
					v-if="permissionsStore.canStudentAccess"
					v-model:open="isNotificationDrawerOpen"
					side="right"
					:overlay="false"
					:ui="{ content: 'max-w-112 mt-16 bg-page-bg', header: 'bg-utd-orange' }"
				>
					<UChip
						:show="unreadNotificationCount > 0"
						:text="unreadNotificationCount"
						:ui="{ base: 'top-2 right-2 h-[20px] min-w-[20px] text-sm ring-0' }"
					>
						<UButton
							variant="ghost"
							icon="i-lucide-inbox"
							class="text-white hover:bg-transparent focus-visible:ring-0 active:bg-transparent"
							aria-label="Open notifications"
						/>
					</UChip>
					<template #header="{ close }">
						<div class="flex w-full items-center justify-between">
							<SharedTextBase class="font-semibold text-white">Notifications</SharedTextBase
							><UButton variant="ghost" class="text-white hover:bg-transparent active:bg-transparent" :icon="icons['close']" @click="close" />
						</div>
					</template>
					<template #body>
						<div v-if="hasActiveQueuePing" class="space-y-3">
							<SharedTextBase>A volunteer is ready to help you.</SharedTextBase>
							<UInput v-model.number="timeEstimateMinutes" type="number" min="1" placeholder="Minutes until you arrive (optional)" class="w-full" />
							<UButton label="Acknowledge" :loading="isAcknowledgingPing" @click="acknowledgeQueuePing" />
						</div>
						<SharedTextBase v-else>No notifications</SharedTextBase>
					</template>
				</USlideover>
				<USlideover
					v-if="showInventoryChangesIcon"
					v-model:open="inventoryStore.inventoryDrawerOpen"
					side="right"
					:overlay="false"
					:ui="{
						content: 'max-w-112 mt-16 bg-page-bg',
						header: 'bg-utd-orange',
					}"
				>
					<UChip
						:show="inventoryStore.numberOfChanges > 0"
						:text="inventoryStore.numberOfChanges"
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
					v-model:open="cartStore.cartView"
					side="right"
					:overlay="false"
					:ui="{
						content: 'max-w-112 mt-16 bg-page-bg',
						header: 'bg-utd-orange',
					}"
				>
					<UButton variant="ghost" class="hover:bg-transparent focus-visible:ring-0 active:bg-transparent">
						<ShoppingCartIcon :cart-view="cartStore.cartView" :cart-disabled="false" :cart-total-count="cartStore.cartTotalCount" />
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
					<UButton v-if="permissionsStore.canStudentAccess" variant="ghost" :icon="icons['profile']" size="lg" />

					<template #content>
						<div class="flex w-64 flex-col items-start gap-2 p-4">
							<UUser
								:name="userSessionInfoStore.displayName"
								:description="userSessionInfoStore.publicCode"
								:avatar="{
									icon: userSessionInfoStore.publicIcon,
								}"
								size="lg"
							/>
							<SharedTextBase class="text-utd-orange">{{ permissionsStore.roleText }}</SharedTextBase>
							<USeparator />
							<UButton variant="outline" color="neutral" :icon="icons['logout']" class="w-full" @click="logout"> Logout </UButton>
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
const permissionsStore = usePermissionsStore()
const userSessionInfoStore = useUserSessionInfoStore()
const queueStore = useQueueStore()

const route = useRoute()
const showCartIcon = computed(() => {
	return route.path.startsWith("/student") && route.path !== "/student/shopping/checkout"
})

const showInventoryChangesIcon = computed(() => {
	return route.path.startsWith("/volunteer/inventory")
})

const { logout } = useLogout()
const isNotificationDrawerOpen = ref(false)
const timeEstimateMinutes = ref<number | null>(null)
const isAcknowledgingPing = ref(false)
const hasActiveQueuePing = computed(() => Boolean(queueStore.queueStatus?.queuePingSentAt && !queueStore.queueStatus?.queuePingAcknowledgedAt))
const unreadNotificationCount = computed(() => (hasActiveQueuePing.value ? 1 : 0))

const acknowledgeQueuePing = async () => {
	isAcknowledgingPing.value = true
	try {
		await $fetch("/api/student/queue/acknowledgePing", {
			method: "PUT",
			body: timeEstimateMinutes.value ? { timeEstimateMinutes: timeEstimateMinutes.value } : {},
		})
		timeEstimateMinutes.value = null
		await queueStore.updateQueueStatus()
		isNotificationDrawerOpen.value = false
	} finally {
		isAcknowledgingPing.value = false
	}
}

let unsubscribeFromStudentEvents: (() => void) | undefined

onMounted(async () => {
	if (!permissionsStore.canStudentAccess) return

	await queueStore.updateQueueStatus()
	const { onEvent } = useStudentEventStream()
	unsubscribeFromStudentEvents = onEvent((event) => {
		if (event.type === "queue.notification.sent") {
			isNotificationDrawerOpen.value = true
			void queueStore.updateQueueStatus()
		}
	})
})

onBeforeUnmount(() => unsubscribeFromStudentEvents?.())

const items = ref<NavigationMenuItem[]>(
	[
		// Student Group
		permissionsStore.canStudentAccess && {
			label: "Student",
			icon: icons["student"],
			open: true,
			children: roleLinks["student"],
		},

		// Volunteer Group
		permissionsStore.canVolunteerAccess && {
			label: "Volunteer",
			icon: icons["volunteer"],
			open: true,
			children: roleLinks["volunteer"],
		},

		// Admin Group
		permissionsStore.canAdminAccess && {
			label: "Admin",
			icon: icons["admin"],
			open: true,
			children: roleLinks["admin"].map((item) => ({
				...item,
				open: true,
			})),
		},

		// Head Admin Group
		permissionsStore.canHeadAdminAccess && {
			label: "Head Admin",
			icon: icons["headAdmin"],
			open: true,
			children: roleLinks["headAdmin"].map((item) => ({
				...item,
				open: true,
			})),
		},
	].filter(Boolean) as NavigationMenuItem[]
) // filter out nulls

const openNavigationMenu = ref(false)
// auto close the navigation menu when the route changes
// auto close the cart drawer when the route changes
watch(
	() => route.fullPath,
	() => {
		openNavigationMenu.value = false
		cartStore.cartView = false
	}
)
</script>
