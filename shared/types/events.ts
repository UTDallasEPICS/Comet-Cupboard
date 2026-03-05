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

export type Decision = "accepted" | "rejected"

export interface EventMap {
	/* system */
	heartbeat: undefined

	/* queue */
	"queue.entryAdded": { entry: QueueEntry }
	"queue.entryRemoved": { entry: QueueEntry }
	"queue.entryApproved": { entry: QueueEntry }
	"queue.queueUpdated": { queue: QueueEntry[]; queueVolunteer?: QueueEntryVolunteer[] }

	/* cart session */
	"cartSession.created": { cartID: string }
	"cartSession.removed": { cartID: string }

	/* cart verification */
	"cart.verification.decision": { decision: Decision; reason?: string }

	/* verify cart list */
	"verifyCartList.cart.added": { cart: any }
	"verifyCartList.cart.removed": { cartID: string }

	/* volunteer */
	"volunteerRequest.decision": { volunteerID: string; decision: Decision }
}

export type AppEvent = {
	[K in keyof EventMap]: EventMap[K] extends undefined ? { type: K } : { type: K; payload: EventMap[K] }
}[keyof EventMap]
