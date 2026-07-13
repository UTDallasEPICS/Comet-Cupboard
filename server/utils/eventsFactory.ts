import type { EventMap } from "#shared/types/events"

/* Overload signatures */
function _createEvent<K extends keyof EventMap>(type: K, payload: EventMap[K]): { type: K; payload: EventMap[K] }
function _createEvent<K extends keyof EventMap>(type: K): { type: K }

function _createEvent<K extends keyof EventMap>(type: K, payload?: EventMap[K]) {
	return payload !== undefined ? { type, payload } : { type }
}

export const createEvent = _createEvent
