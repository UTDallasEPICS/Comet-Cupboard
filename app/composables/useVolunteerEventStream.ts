// module scope (shared across all composable usages)
let eventStream: EventSource | null = null
const listeners: ((event: AppEvent) => void)[] = []

export const useVolunteerEventStream = () => {
	const cartSessionsStore = useCartSessionsStore()
	const toast = useToast()
	const config = useRuntimeConfig()

	const dispatchCartSessionEvent = async (event: AppEvent) => {
		if (["cartSession.created", "cartSession.removed"].includes(event.type)) {
			await cartSessionsStore.handleCartSessionEvent(event)
		}
	}

	const connectVolunteer = () => {
		// Prevent duplicate connections
		if (eventStream) {
			return
		}

		eventStream = new EventSource(`${config.public.LOCAL_URL}api/volunteer/events/volunteer`)

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

				dispatchCartSessionEvent(event)
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

	return { connectVolunteer, onEvent }
}
