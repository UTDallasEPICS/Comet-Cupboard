export const useQueueStore = defineStore("queue", () => {
	const queue = ref([])
	const volunteerQueue = ref([])
	const queueStatus = ref({})

	const getQueue = async () => {
		try {
			const response = await $fetch("/api/student/queue/public")
			queue.value = response
		} catch (e) {
			queue.value = []
		}
	}

	const getVolunteerQueue = async () => {
		try {
			const response = await $fetch("/api/volunteer/queue/queue")
			volunteerQueue.value = response
		} catch (e) {
			volunteerQueue.value = []
		}
	}

	const updateQueueStatus = async () => {
		try {
			const response = await $fetch("/api/student/queue/status")
			queueStatus.value = response
		} catch (e) {
			queueStatus.value = {}
		}
	}

	const handleQueueEvent = async (event: AppEvent) => {
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
		// TODO: Optimize by only updating status if the event affects the current user
		await updateQueueStatus()
	}

	const handleVolunteerQueueEvent = async (event: AppEvent) => {
		switch (event.type) {
			case "queue.queueUpdated":
				volunteerQueue.value = event.payload.queueVolunteer || []
				break
			case "queue.entryAdded":
				volunteerQueue.value.push(event.payload.entry)
				break
			case "queue.entryRemoved":
				volunteerQueue.value = volunteerQueue.value.filter((entry) => entry.publicCode !== event.payload.entry.publicCode)
				break
			case "queue.entryApproved":
				volunteerQueue.value = volunteerQueue.value.filter((entry) => entry.publicCode !== event.payload.entry.publicCode)
				break
		}
	}

	return { handleQueueEvent, handleVolunteerQueueEvent, queue, getQueue, queueStatus, updateQueueStatus, volunteerQueue, getVolunteerQueue }
})
