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
				<SharedButtonActionButton button-variant="ghost" class="hover:bg-transparent active:bg-transparent" size="xl" icon="i-lucide-menu" />

				<template #header="{ close }">
					<div class="flex w-full flex-row items-center justify-between">
						<img src="/CometCupboardLogo2.png" class="aspect-auto h-8" />
						<SharedButtonActionButton
							variant="ghost"
							class="text-white hover:bg-transparent active:bg-transparent"
							icon="i-lucide-x"
							@click="close"
						/>
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
						<SharedButtonActionButton
							variant="ghost"
							icon="i-lucide-inbox"
							class="text-white hover:bg-transparent focus-visible:ring-0 active:bg-transparent"
							aria-label="Open notifications"
						/>
					</UChip>
					<template #header="{ close }">
						<div class="flex w-full items-center justify-between">
							<SharedTextBase class="font-semibold text-white">Notifications</SharedTextBase
							><SharedButtonActionButton
								variant="ghost"
								class="text-white hover:bg-transparent active:bg-transparent"
								icon="i-lucide-x"
								@click="close"
							/>
						</div>
					</template>
					<template #body>
						<div v-if="hasActiveQueuePing" class="space-y-3">
							<UAlert
								icon="i-lucide-message-square"
								title="Volunteer Message"
								description="A volunteer is ready to help you."
								color="neutral"
								variant="subtle"
								class="w-full"
							/>

							<UCard>
								<div class="mb-2">
									<SharedTextBase> When will you arrive? </SharedTextBase>
									<SharedTextBaseSecondary>Let the volunteer know roughly how many minutes until you arrive.</SharedTextBaseSecondary>
								</div>

								<UInput
									v-model.number="timeEstimateMinutes"
									type="number"
									min="0"
									placeholder="Minutes until you arrive (optional)"
									class="w-full"
								/>
							</UCard>

							<div class="flex w-full flex-row items-center justify-end">
								<SharedButtonActionButton
									text="Acknowledge"
									leading-icon="i-lucide-check"
									:loading="isAcknowledgingPing"
									@click="acknowledgeQueuePing"
								/>
							</div>
						</div>

						<SharedTextBase v-else> No notifications </SharedTextBase>
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
						<SharedButtonActionButton
							variant="ghost"
							icon="i-lucide-box"
							class="text-white hover:bg-transparent focus-visible:ring-0 active:bg-transparent"
						/>
					</UChip>

					<template #header="{ close }">
						<div class="flex w-full flex-row items-center justify-between">
							<SharedTextBase class="font-semibold text-white">Inventory Changes</SharedTextBase>
							<SharedButtonActionButton
								variant="ghost"
								class="text-white hover:bg-transparent active:bg-transparent"
								icon="i-lucide-x"
								@click="close"
							/>
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
					<SharedButtonActionButton
						variant="ghost"
						class="hover:bg-transparent focus-visible:ring-0 active:bg-transparent"
						aria-label="Open cart"
						@click="cartStore.cartView = true"
					>
						<ShoppingCartIcon :cart-view="cartStore.cartView" :cart-disabled="false" :cart-total-count="cartStore.cartTotalCount" />
					</SharedButtonActionButton>

					<template #header="{ close }">
						<div class="flex w-full flex-row items-center justify-between">
							<SharedTextBase class="font-semibold text-white">Your Cart</SharedTextBase>
							<SharedButtonActionButton
								variant="ghost"
								class="text-white hover:bg-transparent active:bg-transparent"
								icon="i-lucide-x"
								@click="close"
							/>
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
					<SharedButtonActionButton v-if="permissionsStore.canStudentAccess" button-variant="ghost" icon="i-lucide-circle-user" size="lg" />

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
							<SharedButtonActionButton action="cancel" text="Logout" icon="i-lucide-log-out" class="w-full" @click="logout" />
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
			icon: "i-lucide-user",
			open: true,
			children: roleLinks["student"],
		},

		// Volunteer Group
		permissionsStore.canVolunteerAccess && {
			label: "Volunteer",
			icon: "i-lucide-users",
			open: true,
			children: roleLinks["volunteer"],
		},

		// Admin Group
		permissionsStore.canAdminAccess && {
			label: "Admin",
			icon: "i-lucide-shield",
			open: true,
			children: roleLinks["admin"].map((item) => ({
				...item,
				open: true,
			})),
		},

		// Head Admin Group
		permissionsStore.canHeadAdminAccess && {
			label: "Head Admin",
			icon: "i-lucide-shield-keyhole",
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
