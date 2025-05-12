<template lang="pug">
div
	//- Left side is the people in the cupboard, right is the queue
	div.flex.flex-col.lg_flex-row.items-start.justify-center.gap-10.m-3
		div.flex.items-center.justify-center.flex-grow.w-full
			InCupboardQueue(:queue="insideQueue")
		div.flex.items-center.justify-center.flex-grow.w-full
			WaitingQueue(:queue="waitingQueue")
		<button @click="handleClick" class="bg-blue-500 text-white font-bold py-2 px-4 rounded">
			Click Me
		</button>
		<button @click="handleAddClick" Add to Queue class="bg-blue-500 text-white font-bold py-2 px-4 rounded">
			Add to Queue
		</button>
</template>
<script lang="ts" setup>
import { $fetch } from "ofetch"

// Queues for children components
const waitingQueue = ref([] as string[])
const insideQueue = ref([] as string[])

// Server Side Fetching
const queueUpdates = ref<EventSource | null>(null)

onMounted(() => {
	console.log("hello")
	refreshWaitingQueue()
	refreshInsideQueue()
	queueUpdates.value = new EventSource("/api/queue/queueUpdate")

	queueUpdates.value.onmessage = (event) => {
		const { type, payload } = JSON.parse(event.data)

		if (type === "QUEUE_UPDATE" || type === "QUEUE_ADD") {
			refreshWaitingQueue()
			console.log("Received queue update:", payload)
		}
		if (type == "QUEUE_UPDATE") {
			refreshInsideQueue()
			console.log("U[dated Inside Queue]")
		}
		console.log("Message seen")
	}
})

onBeforeUnmount(() => {
	if (queueUpdates.value) {
		queueUpdates.value.close()
	}
})

// Refresh Waiting Queue
const refreshWaitingQueue = async () => {
	const { data, error } = await useFetch("/api/queue?state=WAITING", {
		method: "GET",
	})

	if (error.value) {
		console.error("Fetch failed:", error.value)
	} else {
		waitingQueue.value = [...(data.value || []).map((item: { netID: string }) => item.netID)]
		console.log("Waiting queue updated!")
	}
}

//Refresh Inside Queue
const refreshInsideQueue = async () => {
	const { data, error } = await useFetch("/api/queue?state=INSIDE", {
		method: "GET",
	})

	if (error.value) {
		console.error("Fetch failed:", error.value)
	} else {
		insideQueue.value = [...(data.value || []).map((item: { netID: string }) => item.netID)] // Extract netID as strings
	}
}

// Test Buttons
const handleClick = async () => {
	console.log("Button clicked!")
	refreshWaitingQueue

	const { data, error } = await useFetch("/api/queue?state=WAITING")

	if (error.value) {
		console.error("Fetch failed:", error.value)
	} else {
		console.log("Queue netIDs:", [...(data.value || [])]) // Should be [] right now
	}
}

const handleAddClick = async () => {
	try {
		await $fetch("/api/queue", {
			method: "POST",
		})
		console.log("Successfully added to queue")
	} catch (err) {
		console.error("Error adding to cupboard:", err)
	}
}
</script>
