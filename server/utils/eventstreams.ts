type EventStream = ReturnType<typeof createEventStream>
type ConnectionMap = Record<string, Record<string, EventStream>>

const createConnectionManager = () => {
	const connectionMap: ConnectionMap = {}

	const addConnection = (userKey: string, connectionId: string, stream: EventStream) => {
		if (!connectionMap[userKey]) {
			connectionMap[userKey] = {}
		}
		connectionMap[userKey][connectionId] = stream
	}

	const removeConnection = (userKey: string, connectionId: string) => {
		delete connectionMap[userKey]?.[connectionId]

		// Cleanup empty user buckets
		if (connectionMap[userKey] && Object.keys(connectionMap[userKey]).length === 0) {
			delete connectionMap[userKey]
		}
	}

	const messageToUser = async (userKey: string, message: string) => {
		const userConnections = connectionMap[userKey]
		if (!userConnections) {
			return
		}

		await Promise.all(Object.values(userConnections).map((stream) => stream.push(message)))
	}

	const broadcast = async (message: string) => {
		await Promise.all(Object.values(connectionMap).flatMap((userConnections) => Object.values(userConnections).map((stream) => stream.push(message))))
	}

	return {
		connectionMap,
		addConnection,
		removeConnection,
		messageToUser,
		broadcast,
	}
}

export const connectionsByRole = {
	student: createConnectionManager(),
	volunteer: createConnectionManager(),
}
