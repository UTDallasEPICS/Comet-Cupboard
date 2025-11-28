<template lang="pug">
//- Queue Page
div
	//- Header for the Queue Page
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(pageTitle="Queue")(class="md_max-w-[600px]").md_rounded-b-xl
	
	div.flex.flex-col.items-start.justify-center.gap-5.m-3.mt-20
		//- Displays the estimated wait time at the top of the page for the student in the queue: the time will be empty for now since the function to implement the timer is not present. 
		div(v-if="!permissions['VERIFY_CART']").flex.items-center.justify-center.flex-grow.w-full.text-xl.lg_text-5xl.font-montserrat.font-bold.text-center
			V2QueueEstimatedWaitTimeDisplay(time="00:00:00")

		//- Displays the # of students in the cupboard at the middle of the page:
		div.flex.items-center.justify-center.flex-grow.w-full
			V2QueueInCupboardDisplay(:queue="insideQueue")

		//- Displays the queue at the bottom of the page:
		div.flex.items-center.justify-center.flex-grow.w-full
			V2QueueInQueueDisplay(:queue="waitingQueue")
</template>

<script lang="ts" setup>
//Router used for navigating to the access denied page:
import { useRouter } from "vue-router"
const router = useRouter()

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
				await router.replace("/v2/queue/deniedAccess")
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
