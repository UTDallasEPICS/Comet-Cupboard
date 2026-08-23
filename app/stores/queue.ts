import type { QueueEntryNonSensitive } from "#shared/types/events"

export const useQueueStore = defineStore("queue", () => {
	const queue = ref<Array<QueueEntryNonSensitive>>([])
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
			const response = await $fetch("/api/volunteer/queue/public")
			queue.value = response
		} catch (error: unknown) {
			queue.value = []
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
			case "queue.notification.sent": {
				const entry = queue.value.find((queueEntry) => queueEntry.publicCode === event.payload.publicCode)
				if (entry) {
					entry.queuePingSentAt = event.payload.sentAt
					entry.queuePingAcknowledgedAt = null
					entry.queuePingAcknowledgementMessage = null
				}
				break
			}
			case "queue.notification.acknowledged": {
				const entry = queue.value.find((queueEntry) => queueEntry.publicCode === event.payload.publicCode)
				if (entry) {
					entry.queuePingAcknowledgedAt = event.payload.acknowledgedAt
					entry.queuePingAcknowledgementMessage = event.payload.acknowledgementMessage
				}
				break
			}
		}
		// TODO: Optimize by only updating status if the event affects the current user
		await updateQueueStatus()
	}

	return { handleQueueEvent, queue, getQueue, getVolunteerQueue, queueStatus, updateQueueStatus }
})
