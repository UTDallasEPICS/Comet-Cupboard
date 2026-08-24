export interface QueueEntryNonSensitive {
	position: number
	publicCode: string
	publicIcon: string
	queuePingSentAt?: string | Date | null
	queuePingAcknowledgedAt?: string | Date | null
	queuePingAcknowledgementMessage?: string | null
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

	/* queue.notification */
	"queue.notification.sent": { publicCode: string; userID: string; sentAt: Date }
	"queue.notification.acknowledged": { publicCode: string; userID: string; acknowledgedAt: Date; acknowledgementMessage: string }

	/* cart session */
	"cartSession.created": { publicCode: string; publicIcon: string }
	"cartSession.removed": { publicCode: string }

	/* cart verification */
	"cart.verification.decision": { publicCode: string; decision: Decision; reason?: string; userID: string }

	/* verify cart list */
	"verifyCartList.cart.added": { cart: any }
	"verifyCartList.cart.removed": { publicCode: string }

	/* global inventory intake session */
	"inventoryIntakeSession.specificItemAmountChange": {
		inventoryIntakeSessionID: string
		specificItemID: string
		productName: string
		imgName: string
		amountChanged: number
		inventoryIntakeSessionItemChangeID: string
	}
	"inventoryIntakeSession.submitted": { inventoryIntakeSessionID: string }
}

export type AppEvent = {
	[K in keyof EventMap]: EventMap[K] extends undefined ? { type: K } : { type: K; payload: EventMap[K] }
}[keyof EventMap]
