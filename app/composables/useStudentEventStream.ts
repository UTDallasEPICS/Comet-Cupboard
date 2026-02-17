let eventStream: EventSource | null = null
const listeners: ((event: AppEvent) => void)[] = []

export const useStudentEventStream = () => {
	const cart = useCartStore()
	const queue = useQueueStore()
	const { handleQueueEvent } = queue
	const toast = useToast()
	const config = useRuntimeConfig()

	const dispatchQueueEvent = (event: AppEvent) => {
		if (event.type in ["queue.queueUpdated", "queue.entryApproved", "queue.entryRemoved", "queue.entryAdded"]) {
			handleQueueEvent(event)
		}
	}

	const connectStudent = () => {
		// Prevent duplicate connections
		if (eventStream) {
			return
		}

		eventStream = new EventSource(`${config.public.LOCAL_URL}api/events/student`)

		eventStream.onopen = () => {
			toast.add({
				title: "Connected",
				description: "Real-time updates are now enabled.",
			})
		}

		eventStream.onmessage = (e) => {
			try {
				const event: AppEvent = JSON.parse(e.data)
				// dispatch to all registered listeners
				listeners.forEach((listener) => listener(event))

				dispatchQueueEvent(event)

				toast.add({
					title: "Event received",
					description: `Received event of type: ${event.type}`,
				})
			} catch (error) {
				toast.add({
					title: "Error parsing event",
					description: `Failed to parse event data: ${error}`,
				})
			}
		}

		eventStream.onerror = () => {
			eventStream?.close()
			eventStream = null
			toast.add({
				title: "Connection lost",
				description: "Try refreshing the page to reconnect.",
			})
		}
	}
	// subscribe to events
	const onEvent = (callback: (event: AppEvent) => void) => {
		listeners.push(callback)
		return () => {
			// unsubscribe
			const index = listeners.indexOf(callback)
			if (index > -1) listeners.splice(index, 1)
		}
	}

	return { connectStudent, onEvent }
}
