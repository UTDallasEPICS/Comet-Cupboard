export interface QueueEntryNonSensitive {
	position: number
	publicCode: string
}

export interface QueueEntry extends QueueEntryNonSensitive {
	netID: string
}

export interface QueueFullPayload {
	queue: QueueEntry[]
}

export interface QueueFullPayloadNonSensitive {
	queue: QueueEntryNonSensitive[]
}

export type Decision = "ACCEPT" | "REJECT"

export interface EventMap {
	/* system */
	heartbeat: undefined

	/* queue */
	"queue.entryAdded": QueueEntry
	"queue.entryRemoved": QueueEntry
	"queue.entryApproved": QueueEntry
	"queue.queueUpdated": QueueEntry[]

	/* cart session */
	"cartSession.created": { cartID: string }
	"cartSession.removed": { cartID: string }

	/* cart verification */
	"cart.verification.decision": { netID: string; decision: Decision; reason?: string }

	/* verify cart list */
	"verifyCartList.cart.added": { cart: any }
	"verifyCartList.cart.removed": { cartID: string }

	/* volunteer */
	"volunteerRequest.decision": { netID: string; decision: Decision }
}

export type AppEvent = {
	[K in keyof EventMap]: EventMap[K] extends undefined ? { type: K } : { type: K; payload: EventMap[K] }
}[keyof EventMap]
