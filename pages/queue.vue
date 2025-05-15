<template lang="pug">
div
	//- Left side is the people in the cupboard, right is the queue
	div.flex.flex-col.lg_flex-row.items-start.justify-center.gap-10.m-3
		div.flex.items-center.justify-center.flex-grow.w-full
			InCupboardQueue(:queue="insideQueue")
		div.flex.items-center.justify-center.flex-grow.w-full
			WaitingQueue(:queue="waitingQueue")
</template>
<script lang="ts" setup>
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
				await logout()
			} else if (type === "QUEUE_MOVE_INSIDE") {
				await navigateTo("/shopping")
				await reloadNuxtApp()
			}
		}
	}
}

onBeforeUnmount(() => {
	if (queueUpdates.value) {
		queueUpdates.value.close()
	}
})

const logout = async () => {
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

	await reloadNuxtApp()

	await navigateTo("/")
}
</script>
