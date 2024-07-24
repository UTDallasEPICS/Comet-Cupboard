type EventStream = ReturnType<typeof createEventStream>

const userMap: { [netID: string]: EventStream } = {}
const volunteerMap: { [netID: string]: EventStream } = {}

const messageToUser = async (netID: string, message: string) => {
    if(userMap[netID]) {
        await userMap[netID].push(message)
    }
}

const broadcastToVolunteers = async (message: string) => {
	Object.entries(volunteerMap).forEach(async ([volunteer, eventstream]) => {
		await eventstream.push(message)
	})
}

export { userMap, volunteerMap, messageToUser, broadcastToVolunteers }
