<template>
	<div>
		<NuxtLayout name="main" title="Queue" :back-navigation="{ text: 'Back to Dashboard', to: '/student' }">
			<USeparator class="my-4" />
			<section>
				<UCard>
					<SharedTextSectionTitle class="mb-4"> Your Status </SharedTextSectionTitle>

					<div>
						<div v-if="queueStore.queueStatus" class="flex flex-row flex-nowrap justify-between">
							<UUser
								:name="queueStore.queueStatus.publicCode"
								:description="`Position: ${queueStore.queueStatus.position}`"
								:avatar="{ icon: queueStore.queueStatus.publicIcon }"
								size="lg"
							/>
							<SharedButtonCancel text="Leave Queue" class="my-auto h-min" @click="leaveQueue" />
						</div>
						<div v-else-if="cartStore.cart" class="flex flex-col items-center justify-center gap-4">
							<SharedTextBase> You already have an active cart. </SharedTextBase>
							<SharedButtonNavigateTo text="Browse Items" to="/student/shopping" />
						</div>
						<div v-else class="flex flex-col items-center justify-center gap-4">
							<SharedTextBase> Currently not in queue </SharedTextBase>
							<SharedButtonPositiveAction text="Join Queue" @click="joinQueue" />
						</div>
					</div>
				</UCard>
			</section>

			<section>
				<UCard class="mt-4">
					<SharedTextSectionTitle class="mb-4"> Current Queue </SharedTextSectionTitle>
					<div v-if="queueStore.queue.length !== 0" class="flex flex-col gap-y-2">
						<UUser
							v-for="queueEntry in queueStore.queue"
							:key="queueEntry.position"
							:name="queueEntry.publicCode"
							:description="`Position: ${queueEntry.position}`"
							:avatar="{ icon: queueEntry.publicIcon }"
							size="lg"
							:class="{
								'bg-utd-green/10': queueEntry.publicCode === queueStore.queueStatus?.publicCode,
								'rounded-lg': true,
							}"
						/>
					</div>
					<div v-else class="flex flex-col items-center justify-center gap-y-4">
						<SharedTextBase> No students in queue </SharedTextBase>
						<img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" />
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

onMounted(async () => {
	await queueStore.getQueue()
	await queueStore.updateQueueStatus()
})

const joinQueue = async () => {
	await $fetch("/api/student/queue/join", {
		method: "POST",
	})
}

const leaveQueue = async () => {
	await $fetch("/api/student/queue/leave", {
		method: "POST",
	})
}
</script>
