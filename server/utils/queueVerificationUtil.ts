type EventStream = ReturnType<typeof createEventStream>

const queueMap: { [netID: string]: { [nanoid: string]: EventStream } } = {}

const messageToQueue = async (netID: string, message: string) => {
	if (queueMap[netID]) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		Object.entries(queueMap[netID]).forEach(async ([nanoid, eventstream]) => {
			await eventstream.push(message)
		})
	}
}

const broadcastToQueue = async (message: string) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	Object.entries(queueMap).forEach(async ([netID, streams]) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		Object.entries(streams).forEach(async ([nanoid, stream]) => {
			await stream.push(message)
		})
	})
}

export { queueMap, messageToQueue, broadcastToQueue }
