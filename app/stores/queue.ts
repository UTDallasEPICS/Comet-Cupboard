export const useQueueStore = defineStore("queue", () => {
	const queue = ref([])
	const queueStatus = ref({})

	const getQueue = async () => {
		try {
			const response = await $fetch("/api/student/queue/public")
			if (response) {
				queue.value = response
			}
		} catch (e) {
			queue.value = []
		}
	}

	const updateQueueStatus = async () => {
		try {
			const response = await $fetch("/api/student/queue/status")
			if (response) {
				queueStatus.value = response
			}
		} catch (e) {
			queueStatus.value = {}
		}
	}
	getQueue()
	updateQueueStatus()

	const handleQueueEvent = (event: AppEvent) => {
		switch (event.type) {
			case "queue.queueUpdated":
				queue.value = event.payload.queue
				break
			case "queue.entryAdded":
				queue.value.push(event.payload.entry)
				break
			case "queue.entryRemoved":
				queue.value = queue.value.filter((entry) => entry.publicCode !== event.payload.entry.publicCode)
				break
			case "queue.entryApproved":
				queue.value = queue.value.filter((entry) => entry.publicCode !== event.payload.entry.publicCode)
				break
		}
	}

	return { handleQueueEvent, queue, getQueue, queueStatus, updateQueueStatus }
})
