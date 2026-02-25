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

export interface QueueEntry {
	position: number
	publicCode: string
}

export interface QueueEntryVolunteer extends QueueEntry {
	netID: string
}

export type QueueEventType = "queue.entryAdded" | "queue.entryRemoved" | "queue.entryApproved" | "queue.queueUpdated"

export interface QueueEvent<T = unknown> extends BaseEvent {
	type: QueueEventType
	payload: T
}
export interface QueueSingleEntryPayload {
	entry: QueueEntry
}

export interface QueueSingleEntryVolunteerPayload {
	entry: QueueEntryVolunteer
}

export interface QueueFullPayload {
	queue: QueueEntry[]
	queueVolunteer?: QueueEntryVolunteer[]
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

export interface CartSessionCreatedEvent extends BaseEvent {
	type: "cartSession.created"
	payload: {
		cartID: string
	}
}

export interface CartSessionRemovedEvent extends BaseEvent {
	type: "cartSession.removed"
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
	| QueueEvent
	| VerifyCartListCartAddedEvent
	| VerifyCartListCartRemovedEvent
	| VolunteerListUpdatedEvent
	| PendingVolunteerRequestRejectedEvent
	| PendingVolunteerRequestAcceptedEvent
	| CartSessionCreatedEvent
	| CartSessionRemovedEvent
