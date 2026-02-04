<template>
	<div>
		<div class="absolute top-20 left-0 z-30 flex h-16 w-full justify-center">
			<V2SharedHeaderSubheader page-title="Queue" class="md:max-w-[600px] md:rounded-b-xl" />
		</div>
		<div class="mx-auto mt-20 flex max-w-[800px] flex-col justify-center gap-y-5">
			<div v-if="!permissions['VERIFY_CART'] && !permissions['SHOPPING']" class="flex w-full flex-grow items-center justify-center">
				<V2QueueEstimatedWaitTimeDisplay time="00:00:00" />
			</div>
			<div class="flex w-full flex-grow items-center justify-center">
				<V2QueueInCupboardDisplay :queue="insideQueue" />
			</div>
			<div class="flex w-full flex-grow items-center justify-center">
				<V2QueueInQueueDisplay :queue="waitingQueue" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
//User permissions:
const accessCookie = ref(useCookie("AccessPermission"))
const permissions = ref(accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {}) //Dirty

// Queues for children components
const { data: waitingData, refresh: refreshWaitingQueue } = await useFetch("/api/queue", {
	query: {
		state: "WAITING",
	},
})
const { data: insideData, refresh: refreshInsideQueue } = await useFetch("/api/queue", {
	query: {
		state: "INSIDE",
	},
})

const waitingQueue = computed(() => {
	if (!waitingData.value) {
		return []
	}
	return waitingData.value.map((student: { netID: string }) => student.netID)
})

const insideQueue = computed(() => {
	if (!insideData.value) {
		return []
	}
	return insideData.value.map((student: { netID: string }) => student.netID)
})

// Server Side Fetching
const queueUpdates = ref<EventSource | null>(null)

const netIDCookie = useCookie("netID")

if (import.meta.client) {
	queueUpdates.value = new EventSource("/api/queue/queueUpdate")

	queueUpdates.value.onmessage = async (event) => {
		const { type, payload } = JSON.parse(event.data)

		if (!type) {
			// this is just a ping
			return
		}
		await refreshWaitingQueue()
		await refreshInsideQueue()

		// QUEUE_DELETE QUEUE_MOVE_INSIDE QUEUE_ADD

		const { netID: queueNetID } = payload

		// queue update for the current user
		if (netIDCookie && netIDCookie.value == queueNetID) {
			await $fetch("/api/updatePermissions", {
				method: "GET",
			})
			// if (type === "QUEUE_ADD") {
			// 	await navigateTo("/queue")
			// }
			if (type === "QUEUE_DELETE") {
				await removeFromQueue()
			} else if (type === "QUEUE_MOVE_INSIDE") {
				await navigateTo("/v2/shopping")
				reloadNuxtApp()
			}
		}
	}
}

onBeforeUnmount(() => {
	if (queueUpdates.value) {
		queueUpdates.value.close()
	}
})

//This function removes the student from the queue and sends them to the Removed From Queue page:
const removeFromQueue = async () => {
	try {
		await $fetch("/api/cart/cart", {
			method: "DELETE",
		})
	} catch (err) {
		//We don't care about this error, we just don't want this to stop us though
	}

	// If the user is in the queue, remove them from the queue
	try {
		await $fetch("/api/queue", {
			method: "DELETE",
			body: {
				netID: useCookie("netID").value,
			},
		})
	} catch (err) {
		//We don't care about this error, we just don't want this to stop us though
	}

	const netIDCookie = useCookie("netID")
	const accessCookie = useCookie("AccessPermission")
	netIDCookie.value = null
	accessCookie.value = null

	await navigateTo("/v2/queue/removed-from-queue")
	await reloadNuxtApp()
}
</script>
