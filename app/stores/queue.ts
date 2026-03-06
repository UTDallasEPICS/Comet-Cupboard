import type { QueueEntry, QueueEntryNonSensitive } from "#shared/types/events"

export const useQueueStore = defineStore("queue", () => {
	const queue = ref<Array<QueueEntryNonSensitive>>([])
	const volunteerQueue = ref<Array<QueueEntry>>([])
	const queueStatus = ref<Record<string, any> | null>(null)

	const getQueue = async () => {
		try {
			const response = await $fetch("/api/student/queue/public")
			queue.value = response
		} catch (error: unknown) {
			queue.value = []
		}
	}

	const getVolunteerQueue = async () => {
		try {
			const response = await $fetch("/api/volunteer/queue/queue")
			volunteerQueue.value = response
		} catch (error: unknown) {
			volunteerQueue.value = []
		}
	}

	const updateQueueStatus = async () => {
		try {
			const response = await $fetch("/api/student/queue/status")
			queueStatus.value = response
		} catch (error: unknown) {
			queueStatus.value = null
		}
	}

	const handleQueueEvent = async (event: AppEvent) => {
		switch (event.type) {
			case "queue.queueUpdated":
				queue.value = event.payload
				break
			case "queue.entryAdded":
				queue.value.push(event.payload)
				break
			case "queue.entryRemoved":
				queue.value = queue.value.filter((entry) => entry.publicCode !== event.payload.publicCode)
				break
			case "queue.entryApproved":
				queue.value = queue.value.filter((entry) => entry.publicCode !== event.payload.publicCode)
				break
		}
		// TODO: Optimize by only updating status if the event affects the current user
		await updateQueueStatus()
	}

	const handleVolunteerQueueEvent = async (event: AppEvent) => {
		switch (event.type) {
			case "queue.queueUpdated":
				volunteerQueue.value = event.payload
				break
			case "queue.entryAdded":
				volunteerQueue.value.push(event.payload)
				break
			case "queue.entryRemoved":
				volunteerQueue.value = volunteerQueue.value.filter((entry) => entry.publicCode !== event.payload.publicCode)
				break
			case "queue.entryApproved":
				volunteerQueue.value = volunteerQueue.value.filter((entry) => entry.publicCode !== event.payload.publicCode)
				break
		}
	}

	return { handleQueueEvent, handleVolunteerQueueEvent, queue, getQueue, queueStatus, updateQueueStatus, volunteerQueue, getVolunteerQueue }
})
