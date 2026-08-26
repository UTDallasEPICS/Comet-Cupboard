<template>
	<div>
		<NuxtLayout name="main" title="Manage Queue" :back-navigation="{ text: 'Back to Dashboard', to: '/volunteer' }">
			<USeparator class="my-4" />
			<SharedLayoutSectionUCard title="Cart Sessions" empty-text="No students in cupboard">
				<SharedLayoutGrid v-if="cartSessionsStore.cartSessions.length !== 0" :columns="1">
					<li v-for="cart in cartSessionsStore.cartSessions" :key="cart.publicCode">
						<DomainCardQueueCartSessionCard
							:cart="{
								publicCode: cart.publicCode,
								publicIcon: cart.publicIcon,
								createdAt: String(cart.createdAt),
							}"
							@cancel="cancelCartSession"
						/>
					</li>
				</SharedLayoutGrid>
			</SharedLayoutSectionUCard>

			<SharedLayoutSectionUCard title="Current Queue" empty-text="No students in queue" class="mt-4">
				<template #headerContent>
					<div class="flex flex-col items-center justify-center gap-2">
						<SharedTextBaseSecondary class="text-center sm:text-right">
							Queue Access Code (Rotating in {{ accessCodeSecondsRemaining }} seconds)
						</SharedTextBaseSecondary>

						<UPinInput :model-value="queueAccessCodeDigits" type="number" autocomplete="one-time-code" :length="6" readonly size="lg" />
					</div>
				</template>

				<div v-if="queueStore.queue.length !== 0" class="w-full">
					<SharedLayoutGrid :columns="1">
						<li v-for="queueEntry in queueStore.queue" :key="queueEntry.position">
							<DomainCardQueueUserCard
								:queue-entry="queueEntry"
								:is-sending-notification="isSendingNotification"
								:notification-public-code="notificationPublicCode"
								@remove="confirmRemoveQueueEntry"
								@approve="approveQueueEntry"
								@ping="sendNotification"
							/>
						</li>
					</SharedLayoutGrid>
				</div>
			</SharedLayoutSectionUCard>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })

const cartSessionsStore = useCartSessionsStore()
const queueStore = useQueueStore()

const { data: queueAccessCode, refresh: refreshQueueAccessCode } = await useFetch("/api/volunteer/queue/access-code")

const accessCodeSecondsRemaining = ref(0)
const notificationPublicCode = ref("")
const isSendingNotification = ref(false)

const queueAccessCodeDigits = computed(() => (queueAccessCode.value?.code ?? "").split("").map(Number))

const updateAccessCodeCountdown = () => {
	const expiresAt = queueAccessCode.value?.expiresAt

	if (!expiresAt) {
		accessCodeSecondsRemaining.value = 0
		return
	}

	accessCodeSecondsRemaining.value = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000))
}

const refreshAccessCode = async () => {
	await refreshQueueAccessCode()
	updateAccessCodeCountdown()
}

let accessCodeTimer: ReturnType<typeof setInterval> | undefined

onMounted(async () => {
	await Promise.all([cartSessionsStore.getCartSessions(), queueStore.getVolunteerQueue()])

	// Initial access code fetch
	await refreshAccessCode()

	// Update the countdown every second.
	// Only fetch a new code when the current one expires.
	accessCodeTimer = setInterval(async () => {
		updateAccessCodeCountdown()

		if (accessCodeSecondsRemaining.value === 0) {
			await refreshAccessCode()
		}
	}, 1000)
})

onBeforeUnmount(() => {
	if (accessCodeTimer) {
		clearInterval(accessCodeTimer)
	}
})

const cancelCartSession = async (publicCode: string) => {
	if (!publicCode) {
		return
	}
	await deleteCartSession(publicCode)
}

const confirmRemoveQueueEntry = async (publicCode: string) => {
	if (!publicCode) {
		return
	}

	await removeQueueEntry({ publicCode })
}

const sendNotification = async (publicCode: string) => {
	notificationPublicCode.value = publicCode
	isSendingNotification.value = true

	try {
		await $fetch("/api/volunteer/queue/notification", {
			method: "POST",
			body: { publicCode },
		})
	} finally {
		notificationPublicCode.value = ""
		isSendingNotification.value = false
	}
}

const deleteCartSession = async (publicCode: string) => {
	await $fetch("/api/volunteer/cart/cart-session", {
		method: "DELETE",
		body: {
			publicCode,
		},
	})

	await cartSessionsStore.getCartSessions()
}

const approveQueueEntry = async (queueEntry: { publicCode: string }) => {
	try {
		await $fetch("/api/volunteer/queue/approve", {
			method: "POST",
			body: {
				publicCode: queueEntry.publicCode,
			},
		})

		await queueStore.getVolunteerQueue()
	} catch (e) {
		console.error("Failed to approve queue entry:", e)
	}
}

const removeQueueEntry = async (queueEntry: { publicCode: string }) => {
	try {
		await $fetch("/api/volunteer/queue/remove", {
			method: "POST",
			body: {
				publicCode: queueEntry.publicCode,
			},
		})

		await queueStore.getVolunteerQueue()
	} catch (e) {
		console.error("Failed to remove queue entry:", e)
	}
}
</script>
