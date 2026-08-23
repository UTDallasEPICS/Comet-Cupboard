<template>
	<div>
		<NuxtLayout name="main" title="Manage Queue" :back-navigation="{ text: 'Back to Dashboard', to: '/volunteer' }">
			<USeparator class="my-4" />

			<!-- Cart Sessions -->
			<section>
				<UCard>
					<SharedTextSectionTitle class="mb-4"> Cart Sessions </SharedTextSectionTitle>
					<USeparator class="my-4" />

					<div v-if="cartSessionsStore.cartSessions.length !== 0" class="flex w-full flex-col gap-y-2">
						<div v-for="cart in cartSessionsStore.cartSessions" :key="cart.publicCode" class="border-border-soft w-full rounded-lg border">
							<UCollapsible class="w-full">
								<UButton color="neutral" variant="ghost" block class="w-full justify-between">
									<UUser :name="cart.publicCode" :avatar="{ icon: cart.publicIcon }" size="lg" />
									<UIcon name="i-lucide-chevron-down" class="size-5" />
								</UButton>
								<template #content>
									<div class="flex flex-wrap items-center justify-between gap-3 border-t p-3">
										<SharedTextBaseSecondary>Current session: {{ formatSessionDuration(cart.createdAt) }}</SharedTextBaseSecondary>
										<UButton label="Cancel Session" icon="i-lucide-x" color="error" @click="openCancelSessionModal(cart.publicCode)" />
									</div>
								</template>
							</UCollapsible>
						</div>
					</div>

					<div v-else class="flex flex-col items-center justify-center gap-y-4">
						<SharedTextBase> No students in cupboard </SharedTextBase>
					</div>
				</UCard>
			</section>

			<UModal v-model:open="isCancelSessionModalOpen">
				<template #content>
					<UCard>
						<SharedTextCardTitle>Confirm Cancel?</SharedTextCardTitle>
						<USeparator class="my-2" />
						<div class="mt-4 flex flex-row items-center justify-center gap-2">
							<SharedButtonCancel text="Cancel" @click="isCancelSessionModalOpen = false" />
							<SharedButtonNegativeAction text="Confirm Cancel" @click="cancelCartSession" />
						</div>
					</UCard>
				</template>
			</UModal>

			<!-- Current Queue -->
			<section>
				<UCard class="mt-4">
					<div class="flex flex-col flex-wrap items-center justify-between gap-4">
						<SharedTextSectionTitle>Current Queue</SharedTextSectionTitle>
						<div class="flex flex-col items-center gap-2">
							<SharedTextBaseSecondary>Queue Access Code (Rotating in {{ accessCodeSecondsRemaining }} seconds)</SharedTextBaseSecondary>
							<UPinInput :model-value="queueAccessCodeDigits" type="number" :length="6" readonly size="lg" />
						</div>
					</div>
					<USeparator class="my-4" />

					<div v-if="queueStore.queue.length !== 0" class="flex w-full flex-col gap-y-2">
						<div v-for="queueEntry in queueStore.queue" :key="queueEntry.position" class="border-border-soft w-full rounded-lg border">
							<UCollapsible class="w-full">
								<UButton color="neutral" variant="ghost" block class="w-full justify-between">
									<div class="flex min-w-0 items-center gap-3 text-left">
										<UUser
											:name="queueEntry.publicCode"
											:description="`Position: ${queueEntry.position}`"
											:avatar="{ icon: queueEntry.publicIcon }"
											size="lg"
										/>
									</div>
									<div class="flex shrink-0 items-center gap-2">
										<UBadge v-if="queueEntry.queuePingAcknowledgedAt" label="Acknowledged" color="secondary" variant="subtle" />
										<UBadge v-else-if="queueEntry.queuePingSentAt" label="Ping sent" color="neutral" variant="subtle" />
										<UIcon name="i-lucide-chevron-down" class="size-5" />
									</div>
								</UButton>

								<template #content>
									<div class="flex flex-wrap justify-end gap-2 border-t p-3">
										<UButton
											label="Remove"
											icon="i-lucide-user-round-minus"
											color="error"
											@click="openRemoveQueueEntryModal(queueEntry.publicCode)"
										/>
										<UButton label="Approve" icon="i-lucide-check" color="secondary" @click="approveQueueEntry(queueEntry)" />
										<UButton
											label="Ping"
											icon="i-lucide-send"
											color="neutral"
											variant="outline"
											:loading="isSendingNotification && notificationPublicCode === queueEntry.publicCode"
											@click="sendNotification(queueEntry.publicCode)"
										/>
									</div>

									<SharedTextBaseSecondary v-if="queueEntry.queuePingAcknowledgedAt" class="px-3 pb-3">
										{{ queueEntry.queuePingAcknowledgementMessage || "Acknowledged" }}
									</SharedTextBaseSecondary>
								</template>
							</UCollapsible>
						</div>
					</div>

					<div v-else class="flex flex-col items-center justify-center gap-y-4">
						<SharedTextBase> No students in queue </SharedTextBase>
					</div>
				</UCard>
			</section>

			<UModal v-model:open="isRemoveQueueEntryModalOpen">
				<template #content>
					<UCard>
						<SharedTextCardTitle>Confirm Removal?</SharedTextCardTitle>
						<USeparator class="my-2" />
						<div class="mt-4 flex flex-row items-center justify-center gap-2">
							<SharedButtonCancel text="Cancel" @click="isRemoveQueueEntryModalOpen = false" />
							<SharedButtonNegativeAction text="Confirm Removal" @click="confirmRemoveQueueEntry" />
						</div>
					</UCard>
				</template>
			</UModal>
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
const isCancelSessionModalOpen = ref(false)
const cartSessionToCancel = ref<string | null>(null)
const isRemoveQueueEntryModalOpen = ref(false)
const queueEntryToRemove = ref<string | null>(null)
const currentTime = ref(Date.now())

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
let sessionDurationTimer: ReturnType<typeof setInterval> | undefined

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

	sessionDurationTimer = setInterval(() => {
		currentTime.value = Date.now()
	}, 1_000)
})

onBeforeUnmount(() => {
	if (accessCodeTimer) {
		clearInterval(accessCodeTimer)
	}
	if (sessionDurationTimer) {
		clearInterval(sessionDurationTimer)
	}
})

const formatSessionDuration = (createdAt: string | Date) => {
	const elapsedSeconds = Math.max(0, Math.floor((currentTime.value - new Date(createdAt).getTime()) / 1_000))
	const hours = Math.floor(elapsedSeconds / 3_600)
	const minutes = Math.floor((elapsedSeconds % 3_600) / 60)
	const seconds = elapsedSeconds % 60
	return hours ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`
}

const openCancelSessionModal = (publicCode: string) => {
	cartSessionToCancel.value = publicCode
	isCancelSessionModalOpen.value = true
}

const cancelCartSession = async () => {
	if (!cartSessionToCancel.value) return

	await deleteCartSession(cartSessionToCancel.value)
	cartSessionToCancel.value = null
	isCancelSessionModalOpen.value = false
}

const openRemoveQueueEntryModal = (publicCode: string) => {
	queueEntryToRemove.value = publicCode
	isRemoveQueueEntryModalOpen.value = true
}

const confirmRemoveQueueEntry = async () => {
	if (!queueEntryToRemove.value) return

	await removeQueueEntry({ publicCode: queueEntryToRemove.value })
	queueEntryToRemove.value = null
	isRemoveQueueEntryModalOpen.value = false
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
