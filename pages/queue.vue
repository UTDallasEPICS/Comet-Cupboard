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
import { $fetch } from "ofetch"

// Queues for children components
const waitingQueue = ref([] as string[])
const insideQueue = ref([] as string[])

const { data: waitingData } = await useFetch("/api/queue?state=WAITING", {
	method: "GET",
})
const { data: insideData } = await useFetch("/api/queue?state=INSIDE", {
	method: "GET",
})

waitingQueue.value = [...(waitingData.value || []).map((item: { netID: string }) => item.netID)]
insideQueue.value = [...(insideData.value || []).map((item: { netID: string }) => item.netID)]

// Server Side Fetching
const queueUpdates = ref<EventSource | null>(null)

onMounted(async () => {
	//Force refresh to update the nav bar
	reloadNuxtApp()

	queueUpdates.value = new EventSource("/api/queue/queueUpdate")

	queueUpdates.value.onmessage = async (event) => {
		const { type, payload } = JSON.parse(event.data)

		if (type === "QUEUE_UPDATE" || type === "QUEUE_ADD") {
			await refreshWaitingQueue()
			console.log("Received queue update:", payload)
		}
		if (type == "QUEUE_UPDATE") {
			await refreshInsideQueue()
			console.log("Updated Inside Queue]")
		}

		const userID = useCookie("netID").value
		const accessCookiePermission = useCookie("AccessPermission")
		const permissions = accessCookiePermission.value && typeof accessCookiePermission.value === "object" ? accessCookiePermission.value : {}

		//We want to simulate an entire logout process if this is true
		if (!waitingQueue.value.includes(userID) && !insideQueue.value.includes(userID) && !permissions["SHOPPING"] && permissions) {
			permissions["RESTRICTED"] = true
			permissions["PUBLIC"] = false
			accessCookiePermission.value = permissions
			try {
				await $fetch("/api/cart/cart", {
					method: "DELETE",
				})
			} catch (err) {
				//We don't care about this error, we just don't want this to stop us though
			}

			await navigateTo("/removed")
			reloadNuxtApp()
		} else if (insideQueue.value.includes(userID) && !permissions["SHOPPING"]) {
			permissions["SHOPPING"] = true
			permissions["SHOPPING_ACTION"] = true

			accessCookiePermission.value = permissions
			await navigateTo("/shopping")
			reloadNuxtApp()
		}
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
</script>
