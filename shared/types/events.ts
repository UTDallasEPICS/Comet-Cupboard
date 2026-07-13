export interface QueueEntryNonSensitive {
	position: number
	publicCode: string
	publicIcon: string
}

export interface QueueFullPayloadNonSensitive {
	queue: QueueEntryNonSensitive[]
}

export type Decision = "ACCEPT" | "REJECT"

export interface EventMap {
	/* system */
	heartbeat: undefined

	/* queue */
	"queue.entryAdded": QueueEntryNonSensitive
	"queue.entryRemoved": QueueEntryNonSensitive
	"queue.entryApproved": QueueEntryNonSensitive
	"queue.queueUpdated": QueueEntryNonSensitive[]

	/* cart session */
	"cartSession.created": { publicCode: string; publicIcon: string }
	"cartSession.removed": { publicCode: string }

	/* cart verification */
	"cart.verification.decision": { publicCode: string; decision: Decision; reason?: string, userID: string }

	/* verify cart list */
	"verifyCartList.cart.added": { cart: any }
	"verifyCartList.cart.removed": { publicCode: string }

	/* volunteer */
	"volunteerRequest.decision": { publicCode: string; decision: Decision, userID: string }
}

export type AppEvent = {
	[K in keyof EventMap]: EventMap[K] extends undefined ? { type: K } : { type: K; payload: EventMap[K] }
}[keyof EventMap]
