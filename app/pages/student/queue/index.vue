<template>
	<div>
		<NuxtLayout name="main" title="Queue" :back-navigation="{ text: 'Back to Dashboard', to: '/student' }">
			<USeparator class="my-4" />
			<section>
				<UCard>
					<SharedTextSectionTitle> Your Status </SharedTextSectionTitle>

					<USeparator class="my-4" />

					<div>
						<div v-if="queueStore.queueStatus" class="flex flex-row flex-nowrap justify-between">
							<UUser
								:name="queueStore.queueStatus.publicCode"
								:description="`Position: ${queueStore.queueStatus.position}`"
								:avatar="{ icon: queueStore.queueStatus.publicIcon }"
								size="lg"
							/>
							<SharedConfirmationModal title="Confirm Leaving Queue?" confirm-text="Confirm Leave" @confirm="confirmLeaveQueue">
								<SharedButtonActionButton action="cancel" text="Leave Queue" leading-icon="i-lucide-log-out" class="my-auto h-min" />
							</SharedConfirmationModal>
						</div>
						<div v-else-if="cartStore.cart" class="flex flex-col items-center justify-center gap-4">
							<SharedTextBase> You currently have an active cart. </SharedTextBase>
							<SharedButtonActionButton action="navigate-to" text="Browse Items" trailing-icon="i-lucide-arrow-right" to="/student/shopping" />
						</div>
						<div v-else class="flex flex-col items-center justify-center gap-4">
							<SharedTextBase> Currently not in queue </SharedTextBase>
							<form class="flex w-full max-w-sm flex-col items-center gap-3" @submit.prevent="joinQueue">
								<SharedTextBaseSecondary>Enter the 6-digit queue code</SharedTextBaseSecondary>
								<UPinInput v-model="accessCode" type="number" :length="6" required size="lg" />
								<SharedButtonActionButton
									type="submit"
									text="Join Queue"
									leading-icon="i-lucide-log-in"
									action="positive"
									:loading="isJoining"
									:disabled="isJoining || accessCode.length !== 6"
								/>
							</form>
						</div>
					</div>
				</UCard>
			</section>

			<section>
				<UCard class="mt-4">
					<SharedTextSectionTitle> Current Queue </SharedTextSectionTitle>
					<USeparator class="my-4" />
					<div v-if="queueStore.queue.length !== 0" class="flex w-full flex-col gap-y-2">
						<DomainCardQueueCurrentEntryCard
							v-for="queueEntry in queueStore.queue"
							:key="queueEntry.position"
							:queue-entry="queueEntry"
							:is-current="queueEntry.publicCode === queueStore.queueStatus?.publicCode"
						/>
					</div>
					<div v-else class="flex flex-col items-center justify-center gap-y-4">
						<SharedTextBase> No students in queue </SharedTextBase>
						<!-- <img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" /> -->
					</div>
				</UCard>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })

const queueStore = useQueueStore()
const cartStore = useCartStore()
const accessCode = ref<number[]>([])
const isJoining = ref(false)
const joinQueue = async () => {
	isJoining.value = true
	try {
		await $fetch("/api/student/queue/join", { method: "POST", body: { code: accessCode.value.join("") } })
		accessCode.value = []
	} finally {
		isJoining.value = false
	}
}

const leaveQueue = async () => {
	await $fetch("/api/student/queue/leave", {
		method: "POST",
	})
}

const confirmLeaveQueue = async () => {
	await leaveQueue()
}
</script>
