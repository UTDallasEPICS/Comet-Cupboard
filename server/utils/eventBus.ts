import { connectionsByRole } from "#server/utils/eventstreams"
import type { AppEvent } from "#shared/types/events"

// Fire-and-forget WebSocket broadcast (shouldn't await this since we don't want to block the main flow of the API handler)
export const publishEvent = async (event: AppEvent) => {
	switch (event.type) {
		case "queue.entryAdded":
			connectionsByRole.student.broadcast(
				JSON.stringify({
					type: "queue.entryAdded",
					payload: {
						position: event.payload.position,
						publicCode: event.payload.publicCode,
						publicIcon: event.payload.publicIcon,
					},
				})
			)
			break
		case "queue.entryRemoved":
			connectionsByRole.student.broadcast(
				JSON.stringify({
					type: "queue.entryRemoved",
					payload: {
						position: event.payload.position,
						publicCode: event.payload.publicCode,
					},
				})
			)
			break
		case "queue.entryApproved":
			connectionsByRole.student.broadcast(
				JSON.stringify({
					type: "queue.entryApproved",
					payload: {
						position: event.payload.position,
						publicCode: event.payload.publicCode,
					},
				})
			)
			break
		case "queue.queueUpdated":
			connectionsByRole.student.broadcast(
				JSON.stringify({
					type: "queue.queueUpdated",
					payload: {
						queue: event.payload.map((entry) => {
							return {
								position: entry.position,
								publicCode: entry.publicCode,
								publicIcon: entry.publicIcon,
							}
						}),
					},
				})
			)
			break
		case "cartSession.created":
			connectionsByRole.volunteer.broadcast(
				JSON.stringify({
					type: "cartSession.created",
					payload: event.payload,
				})
			)
			break
		case "cartSession.removed":
			connectionsByRole.volunteer.broadcast(
				JSON.stringify({
					type: "cartSession.removed",
					payload: event.payload,
				})
			)
			break
		case "cart.verification.decision":
			connectionsByRole.student.messageToUser(
				event.payload.userID,
				JSON.stringify({
					type: "cart.verification.decision",
					payload: event.payload,
				})
			)
			break
		case "verifyCartList.cart.added":
			connectionsByRole.volunteer.broadcast(
				JSON.stringify({
					type: "verifyCartList.cart.added",
					payload: event.payload,
				})
			)
			break
		case "verifyCartList.cart.removed":
			connectionsByRole.volunteer.broadcast(
				JSON.stringify({
					type: "verifyCartList.cart.removed",
					payload: event.payload,
				})
			)
			break
		default:
			console.warn(`Unhandled event type: ${event.type}`)
	}
}
