import { connectionsByRole } from "#server/utils/eventstreams"
import type { AppEvent } from "#shared/types/events"

export async function publishEvent(event: AppEvent) {
	switch (event.type) {
		case "queue.entryAdded":
			break
		case "queue.entryRemoved":
			break
		case "queue.entryApproved":
			break
		case "queue.queueUpdated":
			break
		case "cartSession.created":
			break
		case "cartSession.removed":
			break
		case "cart.verification.decision":
			break
		case "verifyCartList.cart.added":
			break
		case "verifyCartList.cart.removed":
			break
		case "volunteerRequest.decision":
			break
		default:
			console.warn(`Unhandled event type: ${event.type}`)
	}
}
