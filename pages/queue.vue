<template lang="pug">
div
	//- Left side is the people in the cupboard, right is the queue
	div.flex.flex-col.lg_flex-row.items-start.justify-center.gap-10.m-3
		div.flex.items-center.justify-center.flex-grow.w-full
			InCupboardQueue
		div.flex.items-center.justify-center.flex-grow.w-full
			WaitingQueue
		<button @click="handleClick" class="bg-blue-500 text-white font-bold py-2 px-4 rounded">
			Click Me
		</button>
		button @click="handleAddClick" Add to Queue
</template>
<script lang="ts" setup>
import { $fetch } from "ofetch"

const handleClick = async () => {
	console.log("Button clicked!")

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
