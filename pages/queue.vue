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
const waitingQueue = ref([] as string[])
const insideQueue = ref([] as string[])

const { data: waitingData, refresh: refreshWaitingQueue } = await useFetch("/api/queue?state=WAITING")
const { data: insideData, refresh: refreshInsideQueue } = await useFetch("/api/queue?state=INSIDE")

waitingQueue.value = [...(waitingData.value || []).map((item: { netID: string }) => item.netID)]
insideQueue.value = [...(insideData.value || []).map((item: { netID: string }) => item.netID)]

// Server Side Fetching
const queueUpdates = ref<EventSource | null>(null)

onMounted(async () => {
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
			permissions["PUBLIC"] = false
			accessCookiePermission.value = permissions
			try {
				await $fetch("/api/cart/cart", {
					method: "DELETE",
				})
			} catch (err) {
				//We don't care about this error, we just don't want this to stop us though
			}
			const netIDCookie = useCookie("netID")
			netIDCookie.value = null
			await navigateTo("/")
		} else if (insideQueue.value.includes(userID) && !permissions["SHOPPING"]) {
			await $fetch("/api/updatePermissions", {
				method: "GET",
			})
			await navigateTo("/shopping")
			//Force refresh to update the nav bar
			refreshCookie("netID")
			refreshCookie("AccessPermission")
			reloadNuxtApp()
		}
	}
})

onBeforeUnmount(() => {
	if (queueUpdates.value) {
		queueUpdates.value.close()
	}
})
</script>
