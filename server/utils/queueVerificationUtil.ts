type EventStream = ReturnType<typeof createEventStream>

const queueMap: { [netID: string]: EventStream } = {}

const messageToQueue = async (netID: string, message: string) => {
	if (queueMap[netID]) {
		await queueMap[netID].push(message)
	}
}

const broadcastToQueue = async (message: string) => {
	Object.values(queueMap).forEach(async (stream) => {
		await stream.push(message)
	})
}

export { queueMap, messageToQueue, broadcastToQueue }
