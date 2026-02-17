type EventStream = ReturnType<typeof createEventStream>

const studentMap: { [netID: string]: { [nanoid: string]: EventStream } } = {}

const messageToStudent = async (netID: string, message: string) => {
	if (studentMap[netID]) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		Object.entries(studentMap[netID]).forEach(async ([nanoid, eventstream]) => {
			await eventstream.push(message)
		})
	}
}

const broadcastToStudents = async (message: string) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	Object.entries(studentMap).forEach(async ([netID, eventstreams]) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		Object.entries(eventstreams).forEach(async ([nanoid, eventstream]) => {
			await eventstream.push(message)
		})
	})
}

export { studentMap, messageToStudent, broadcastToStudents }
