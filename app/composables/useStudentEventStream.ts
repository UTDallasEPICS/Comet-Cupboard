let eventStream: EventSource | null = null
const listeners: ((event: AppEvent) => void)[] = []

export const useStudentEventStream = () => {
	const cartStore = useCartStore()
	const queueStore = useQueueStore()
	const toast = useToast()
	const config = useRuntimeConfig()

	const dispatchQueueEvent = async (event: AppEvent) => {
		if (
			[
				"queue.queueUpdated",
				"queue.entryApproved",
				"queue.entryRemoved",
				"queue.entryAdded",
				"queue.notification.sent",
				"queue.notification.acknowledged",
			].includes(event.type)
		) {
			await queueStore.handleQueueEvent(event)
		}
	}

	const dispatchCartEvent = async (event: AppEvent) => {
		if (["queue.entryApproved", "cart.verification.decision"].includes(event.type)) {
			await cartStore.handleCartEvent(event)
		}
	}

	const connectStudent = () => {
		// Prevent duplicate connections
		if (eventStream) {
			return
		}

		eventStream = new EventSource(`${config.public.LOCAL_URL}api/student/events/student`)

		eventStream.onopen = () => {
			// toast.add({
			// 	title: "Connected",
			// 	description: "Real-time updates are now enabled.",
			// })
		}

		eventStream.onmessage = (e) => {
			try {
				const event: AppEvent = JSON.parse(e.data)
				// dispatch to all registered listeners
				listeners.forEach((listener) => listener(event))

				dispatchCartEvent(event)
				dispatchQueueEvent(event)
			} catch (error) {}
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
