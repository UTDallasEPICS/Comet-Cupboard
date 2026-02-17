<template>
	<UContainer class="py-8">
		<header>
			<SharedTextPageTitle>Queue</SharedTextPageTitle>
		</header>

		<!-- Queue Overview -->
		<section class="mt-4">
			<UCard>
				<template #header>
					<SharedTextSectionTitle> Current Status </SharedTextSectionTitle>
				</template>

				<div class="space-y-2">
					<!-- <SharedTextBase> Students in Queue: {{ studentsInQueue }} </SharedTextBase>

					<SharedTextBase>
						Estimated Wait If You Join Now:
						{{ estimatedWaitIfJoinNow }} minutes
					</SharedTextBase> -->
					<SharedTextBase> Public Code: {{ queueStatus.publicCode }} </SharedTextBase>
					<SharedTextBase> Position: {{ queueStatus.position }} </SharedTextBase>
				</div>
			</UCard>
		</section>

		<section class="mt-4">
			<UCard>
				<div class="space-y-4">
					<SharedTextBase> You are not currently in the queue. </SharedTextBase>

					<UButton block @click="joinQueue"> Join Queue </UButton>
				</div>
			</UCard>
		</section>
	</UContainer>
</template>

<script lang="ts" setup>
const queueStore = useQueueStore()
const { queue, queueStatus } = storeToRefs(queueStore)

onMounted(() => {
	queueStore.getQueue()
	queueStore.updateQueueStatus()
})

const joinQueue = async () => {
	await $fetch("/api/queue/join", {
		method: "POST",
	})
}

const leaveQueue = async () => {
	await $fetch("/api/queue/leave", {
		method: "POST",
	})
}
</script>
