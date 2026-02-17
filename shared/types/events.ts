export interface BaseEvent {
	type: string
	payload?: any
}

export interface HeartbeatEvent extends BaseEvent {
	type: "heartbeat"
}

export interface PendingVerificationRejectedEvent extends BaseEvent {
	type: "cart.verification.rejected"
	payload: {
		reason: string
	}
}

export interface PendingVerificationAcceptedEvent extends BaseEvent {
	type: "cart.verification.accepted"
	payload: {
		reason: string
	}
}

export interface QueueUpdatedEvent extends BaseEvent {
	type: "queue.updated"
	payload: {
		numberInCupboard: number
		numberInQueue: number
		ownPositionInQueue: number | null
	}
}

export interface VerifyCartListCartAddedEvent extends BaseEvent {
	type: "verifyCartList.cart.added"
	payload: {
		cart: any
	}
}

export interface VerifyCartListCartRemovedEvent extends BaseEvent {
	type: "verifyCartList.cart.removed"
	payload: {
		cartID: string
	}
}

export interface PendingVolunteerRequestRejectedEvent extends BaseEvent {
	type: "volunteerRequest.rejected"
}

export interface PendingVolunteerRequestAcceptedEvent extends BaseEvent {
	type: "volunteerRequest.accepted"
}

export interface VolunteerListUpdatedEvent extends BaseEvent {
	type: "volunteerList.updated"
	payload: {
		volunteers: string[]
	}
}

export type AppEvent =
	| HeartbeatEvent
	| PendingVerificationRejectedEvent
	| PendingVerificationAcceptedEvent
	| QueueUpdatedEvent
	| VerifyCartListCartAddedEvent
	| VerifyCartListCartRemovedEvent
	| VolunteerListUpdatedEvent
	| PendingVolunteerRequestRejectedEvent
	| PendingVolunteerRequestAcceptedEvent
