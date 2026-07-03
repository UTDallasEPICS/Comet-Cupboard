<template>
	<div>
		<NuxtLayout name="main" title="Queue" :back-navigation="{ text: 'Back to Dashboard', to: '/student' }">
			<section>
				<UCard>
					<SharedTextSectionTitle class="mb-4"> Current Status </SharedTextSectionTitle>

					<div class="space-y-2">
						<div v-if="queueStore.queueStatus" class="flex flex-row justify-between">
							<UUser
								:name="queueStore.queueStatus.publicCode"
								:description="`Position: ${queueStore.queueStatus.position}`"
								:avatar="{ icon: queueStore.queueStatus.publicIcon }"
								size="xl"
							/>
							<SharedButtonCancel text="Leave Queue" class="my-auto h-min" @click="leaveQueue" />
						</div>
						<div v-else>
							<div v-if="cartStore.cart">
								<SharedTextBase> You already have an active cart. </SharedTextBase>
							</div>
							<div v-else>
								<SharedTextBase> You are not currently in the queue. </SharedTextBase>
								<SharedButtonPositiveAction text="Join Queue" @click="joinQueue" />
							</div>
						</div>
					</div>
				</UCard>
			</section>

			<section>
				<UCard class="mt-4">
					<SharedTextSectionTitle class="mb-4"> Current Queue </SharedTextSectionTitle>
					<div v-for="queueEntry in queueStore.queue" :key="queueEntry.position">
						<UUser
							:name="queueEntry.publicCode"
							:description="`Position: ${queueEntry.position}`"
							:avatar="{ icon: queueEntry.publicIcon }"
							size="xl"
							:class="{
								'bg-utd-green/10': queueEntry.publicCode === queueStore.queueStatus?.publicCode,
								'rounded-lg': true,
							}"
						/>
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
