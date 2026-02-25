type EventStream = ReturnType<typeof createEventStream>

const volunteerMap: { [netID: string]: { [nanoid: string]: EventStream } } = {}

const messageToVolunteer = async (netID: string, message: string) => {
	if (volunteerMap[netID]) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		Object.entries(volunteerMap[netID]).forEach(async ([nanoid, eventstream]) => {
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

export { volunteerMap, messageToVolunteer, broadcastToVolunteers }
