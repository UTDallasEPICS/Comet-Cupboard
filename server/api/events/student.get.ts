import { nanoid } from "nanoid"
import { constructHeartbeatEvent } from "#server/utils/eventsUtil"
import { studentMap } from "#server/utils/studentStreamUtil"

export default defineEventHandler((event) => {
	const eventStream = createEventStream(event)
	const eventStreamID = nanoid()

    // Send a heartbeat event every 60 seconds to detect disconnections and clean up resources
	const heartbeatInterval = setInterval(async () => {
		try {
			await eventStream.push(JSON.stringify(constructHeartbeatEvent()))
		} catch {
			clearInterval(heartbeatInterval)
			eventStream.close()
			if (studentMap[event.context.user.netID][eventStreamID]) {
				delete studentMap[event.context.user.netID][eventStreamID]
				if (Object.keys(studentMap[event.context.user.netID]).length === 0) {
					delete studentMap[event.context.user.netID]
				}
			}
		}
	}, 60 * 1000)

	eventStream.onClosed(async () => {
		clearInterval(heartbeatInterval)
		await eventStream.close()
		if (studentMap[event.context.user.netID][eventStreamID]) {
			delete studentMap[event.context.user.netID][eventStreamID]
			if (Object.keys(studentMap[event.context.user.netID]).length === 0) {
				delete studentMap[event.context.user.netID]
			}
		}
	})

	if (!studentMap[event.context.user.netID]) {
		studentMap[event.context.user.netID] = {}
	}

	studentMap[event.context.user.netID][eventStreamID] = eventStream

	return eventStream.send()
})
