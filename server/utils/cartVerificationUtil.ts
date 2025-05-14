type EventStream = ReturnType<typeof createEventStream>

const userMap: { [netID: string]: { [nanoid: string]: EventStream } } = {}
const volunteerMap: { [netID: string]: { [nanoid: string]: EventStream } } = {}

const messageToUser = async (netID: string, message: string) => {
	if (userMap[netID]) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		Object.entries(userMap[netID]).forEach(async ([nanoid, eventstream]) => {
			await eventstream.push(message)
		})
	}
}

const broadcastToVolunteers = async (message: string) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	Object.entries(volunteerMap).forEach(async ([netID, eventstreams]) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		Object.entries(eventstreams).forEach(async ([nanoid, eventstream]) => {
			await eventstream.push(message)
		})
	})
}

export { userMap, volunteerMap, messageToUser, broadcastToVolunteers }
