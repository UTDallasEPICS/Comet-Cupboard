import type {
	HeartbeatEvent,
	PendingVerificationRejectedEvent,
	PendingVerificationAcceptedEvent,
	QueueUpdatedEvent,
	VerifyCartListCartAddedEvent,
	VerifyCartListCartRemovedEvent,
	PendingVolunteerRequestRejectedEvent,
	PendingVolunteerRequestAcceptedEvent,
	VolunteerListUpdatedEvent,
} from "#shared/types/events"

export const constructHeartbeatEvent = (): HeartbeatEvent => {
	return { type: "heartbeat" }
}

export const constructPendingVerificationRejectedEvent = (reason: string): PendingVerificationRejectedEvent => {
	return { type: "cart.verification.rejected", payload: { reason } }
}

export const constructPendingVerificationAcceptedEvent = (reason: string): PendingVerificationAcceptedEvent => {
	return { type: "cart.verification.accepted", payload: { reason } }
}

export const constructQueueUpdatedEvent = (numberInCupboard: number, numberInQueue: number, ownPositionInQueue: number | null): QueueUpdatedEvent => {
	return { type: "queue.updated", payload: { numberInCupboard, numberInQueue, ownPositionInQueue } }
}

export const constructVerifyCartListCartAddedEvent = (cart: any): VerifyCartListCartAddedEvent => {
	return { type: "verifyCartList.cart.added", payload: { cart } }
}

export const constructVerifyCartListCartRemovedEvent = (cartID: string): VerifyCartListCartRemovedEvent => {
	return { type: "verifyCartList.cart.removed", payload: { cartID } }
}

export const constructPendingVolunteerRequestRejectedEvent = (): PendingVolunteerRequestRejectedEvent => {
	return { type: "volunteerRequest.rejected" }
}

export const constructPendingVolunteerRequestAcceptedEvent = (): PendingVolunteerRequestAcceptedEvent => {
	return { type: "volunteerRequest.accepted" }
}

export const constructVolunteerListUpdatedEvent = (volunteers: string[]): VolunteerListUpdatedEvent => {
	return { type: "volunteerList.updated", payload: { volunteers } }
}
