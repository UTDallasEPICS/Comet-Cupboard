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
// const accessCookie = ref(useCookie("AccessPermission"))
// const permissions = ref(accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {}) //Dirty

// const { data: waitingData, refresh: refreshWaitingQueue } = await useFetch("/api/queue", {
// 	query: {
// 		state: "WAITING",
// 	},
// })
// const { data: insideData, refresh: refreshInsideQueue } = await useFetch("/api/queue", {
// 	query: {
// 		state: "INSIDE",
// 	},
// })

// const waitingQueue = computed(() => {
// 	if (!waitingData.value) {
// 		return []
// 	}
// 	return waitingData.value.map((student: { netID: string }) => student.netID)
// })

// const insideQueue = computed(() => {
// 	if (!insideData.value) {
// 		return []
// 	}
// 	return insideData.value.map((student: { netID: string }) => student.netID)
// })

// const queueUpdates = ref<EventSource | null>(null)

// const netIDCookie = useCookie("netID")

// if (import.meta.client) {
// 	queueUpdates.value = new EventSource("/api/queue/queueUpdate")

// 	queueUpdates.value.onmessage = async (event) => {
// 		const { type, payload } = JSON.parse(event.data)

// 		if (!type) {
// 			// this is just a ping
// 			return
// 		}
// 		await refreshWaitingQueue()
// 		await refreshInsideQueue()

// 		// QUEUE_DELETE QUEUE_MOVE_INSIDE QUEUE_ADD

// 		const { netID: queueNetID } = payload

// 		// queue update for the current user
// 		if (netIDCookie && netIDCookie.value == queueNetID) {
// 			await $fetch("/api/updatePermissions", {
// 				method: "GET",
// 			})
// 			// if (type === "QUEUE_ADD") {
// 			// 	await navigateTo("/queue")
// 			// }
// 			if (type === "QUEUE_DELETE") {
// 				await removeFromQueue()
// 			} else if (type === "QUEUE_MOVE_INSIDE") {
// 				await navigateTo("/shopping")
// 				reloadNuxtApp()
// 			}
// 		}
// 	}
// }

// onBeforeUnmount(() => {
// 	if (queueUpdates.value) {
// 		queueUpdates.value.close()
// 	}
// })

// //This function removes the student from the queue and sends them to the Removed From Queue page:
// const removeFromQueue = async () => {
// 	try {
// 		await $fetch("/api/cart/cart", {
// 			method: "DELETE",
// 		})
// 	} catch (err) {
// 		//We don't care about this error, we just don't want this to stop us though
// 	}

// 	// If the user is in the queue, remove them from the queue
// 	try {
// 		await $fetch("/api/queue", {
// 			method: "DELETE",
// 			body: {
// 				netID: useCookie("netID").value,
// 			},
// 		})
// 	} catch (err) {
// 		//We don't care about this error, we just don't want this to stop us though
// 	}

// 	const netIDCookie = useCookie("netID")
// 	const accessCookie = useCookie("AccessPermission")
// 	netIDCookie.value = null
// 	accessCookie.value = null

// 	await reloadNuxtApp()
// }


type QueueStatus =
  | 'not_in_queue'
  | 'in_queue'
  | 'in_cupboard'

// 🔁 Change this to test different states
const queueStatus = ref<QueueStatus>('not_in_queue')
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
  avgServiceTimePerStudent: 6 // minutes
})

/**
 * Calculate estimated wait if joining now
 */
const estimatedWaitIfJoinNow = computed(() => {
  return queueStats.value.studentsInQueue *
    queueStats.value.avgServiceTimePerStudent
})

/**
 * Fake personal queue info (if in queue)
 */
const myQueueInfo = ref({
  position: 4,
  estimatedWait: 4 * queueStats.value.avgServiceTimePerStudent
})

function joinQueue() {
  queueStatus.value = 'in_queue'
}

function leaveQueue() {
  queueStatus.value = 'not_in_queue'
}
</script>
