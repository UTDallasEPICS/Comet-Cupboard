import type {
	HeartbeatEvent,
	PendingVerificationRejectedEvent,
	PendingVerificationAcceptedEvent,
	QueueEvent,
	VerifyCartListCartAddedEvent,
	VerifyCartListCartRemovedEvent,
	PendingVolunteerRequestRejectedEvent,
	PendingVolunteerRequestAcceptedEvent,
	VolunteerListUpdatedEvent,
	QueueEntry,
	QueueSingleEntryPayload,
	QueueEntryVolunteer,
	QueueSingleEntryVolunteerPayload,
	QueueFullPayload,
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

export const constructQueueEntryAddedEvent = (entry: QueueEntry): QueueEvent<QueueSingleEntryPayload> => {
	return { type: "queue.entryAdded", payload: { entry } }
}

export const constructQueueEntryRemovedEvent = (entry: QueueEntry): QueueEvent<QueueSingleEntryPayload> => {
	return { type: "queue.entryRemoved", payload: { entry } }
}

export const constructQueueEntryApprovedEvent = (entry: QueueEntry): QueueEvent<QueueSingleEntryPayload> => {
	return { type: "queue.entryApproved", payload: { entry } }
}

export const constructQueueEntryAddedVolunteerEvent = (entry: QueueEntryVolunteer): QueueEvent<QueueSingleEntryVolunteerPayload> => {
	return { type: "queue.entryAdded", payload: { entry } }
}

export const constructQueueEntryRemovedVolunteerEvent = (entry: QueueEntryVolunteer): QueueEvent<QueueSingleEntryVolunteerPayload> => {
	return { type: "queue.entryRemoved", payload: { entry } }
}

export const constructQueueEntryApprovedVolunteerEvent = (entry: QueueEntryVolunteer): QueueEvent<QueueSingleEntryVolunteerPayload> => {
	return { type: "queue.entryApproved", payload: { entry } }
}

export const constructQueueUpdatedEvent = (queue: QueueEntry[], queueVolunteer?: QueueEntryVolunteer[]): QueueEvent<QueueFullPayload> => {
	return { type: "queue.queueUpdated", payload: { queue, queueVolunteer } }
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
