<!-- <template>
	<UContainer class="py-8">
		<header>
			<SharedTextPageTitle>Queue</SharedTextPageTitle>
		</header>
		<section class="mt-4">
			<UCard>
				<template #header>
					<SharedTextSectionTitle>Queue Status</SharedTextSectionTitle>
				</template>
				<SharedTextBase>Estimated Wait Time: 10 minutes</SharedTextBase>
			</UCard>
		</section>
		<section class="mt-4">
			<UCard>
				<template #header>
					<SharedTextSectionTitle>In Cupboard</SharedTextSectionTitle>
				</template>
				<SharedTextBase># of students: {{ 1 }}</SharedTextBase>
			</UCard>
		</section>
		<section class="mt-4">
			<UCard>
				<template #header>
					<SharedTextSectionTitle>In Queue</SharedTextSectionTitle>
				</template>
				<SharedTextBase># of students: {{ 1 }}</SharedTextBase>
			</UCard>
		</section>
	</UContainer>
</template> -->

<template>
	<UContainer class="py-8">
		<header>
			<SharedTextPageTitle>Queue</SharedTextPageTitle>
		</header>

		<!-- Queue Overview -->
		<section class="mt-4">
			<UCard>
				<template #header>
					<SharedTextSectionTitle>Current Status</SharedTextSectionTitle>
				</template>

				<div class="space-y-2">
					<SharedTextBase> Students in Queue: {{ queueStats.studentsInQueue }} </SharedTextBase>

					<SharedTextBase> Students in Cupboard: {{ queueStats.studentsInCupboard }} </SharedTextBase>

					<SharedTextBase>
						Estimated Wait If You Join Now:
						{{ queueStats.estimatedWaitIfJoinNow }} minutes
					</SharedTextBase>
				</div>
			</UCard>
		</section>

		<!-- Action / Personal Status -->
		<section class="mt-4">
			<UCard>
				<!-- NOT IN QUEUE -->
				<div v-if="queueStatus === 'not_in_queue'" class="space-y-4">
					<SharedTextBase> You are not currently in the queue. </SharedTextBase>

					<UButton block @click="joinQueue"> Join Queue </UButton>
				</div>

				<!-- IN QUEUE -->
				<div v-else-if="queueStatus === 'in_queue'" class="space-y-2">
					<SharedTextSectionTitle> You Are In The Queue </SharedTextSectionTitle>

					<SharedTextBase> Your Position: {{ myQueueInfo.position }} </SharedTextBase>

					<SharedTextBase> Estimated Wait: {{ myQueueInfo.estimatedWait }} minutes </SharedTextBase>

					<UButton color="red" variant="soft" block @click="leaveQueue"> Leave Queue </UButton>
				</div>

				<!-- IN CUPBOARD -->
				<div v-else class="space-y-2">
					<SharedTextSectionTitle> You Are Currently In Cupboard </SharedTextSectionTitle>

					<SharedTextBase> You already have an active cart session. </SharedTextBase>

					<UAlert color="amber" variant="soft" title="Queue Disabled" description="You cannot join the queue while you are in cupboard." />
				</div>
			</UCard>
		</section>
	</UContainer>
</template>

<script lang="ts" setup>
type QueueStatus = "not_in_queue" | "in_queue" | "in_cupboard"

// 🔁 Change this to test different states
const queueStatus = ref<QueueStatus>("not_in_queue")
// try:
// 'not_in_queue'
// 'in_queue'
// 'in_cupboard'

/**
 * Fake queue numbers
 */
const queueStats = ref({
	studentsInQueue: 7,
	studentsInCupboard: 3,
	avgServiceTimePerStudent: 6, // minutes
})

/**
 * Calculate estimated wait if joining now
 */
const estimatedWaitIfJoinNow = computed(() => {
	return queueStats.value.studentsInQueue * queueStats.value.avgServiceTimePerStudent
})

/**
 * Fake personal queue info (if in queue)
 */
const myQueueInfo = ref({
	position: 4,
	estimatedWait: 4 * queueStats.value.avgServiceTimePerStudent,
})

async function joinQueue() {
	queueStatus.value = "in_queue"
	await $fetch("/api/queue/join", { method: "GET" })
}

function leaveQueue() {
	queueStatus.value = "not_in_queue"
}
</script>
