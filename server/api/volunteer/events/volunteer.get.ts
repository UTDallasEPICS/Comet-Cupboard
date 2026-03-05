import { nanoid } from "nanoid"
import { createEvent } from "~~/server/utils/eventsFactory"
import { connectionsByRole } from "#server/utils/eventstreams"

export default defineEventHandler((event) => {
	const eventStream = createEventStream(event)
	const eventStreamID = nanoid()

	// Send a heartbeat event every 60 seconds to detect disconnections and clean up resources
	const heartbeatInterval = setInterval(async () => {
		try {
			await eventStream.push(JSON.stringify(createEvent("heartbeat")))
		} catch {
			clearInterval(heartbeatInterval)
			eventStream.close()
			connectionsByRole.volunteer.removeConnection(event.context.user.netID, eventStreamID)
		}
	}, 60 * 1000)

	eventStream.onClosed(async () => {
		clearInterval(heartbeatInterval)
		await eventStream.close()
		connectionsByRole.volunteer.removeConnection(event.context.user.netID, eventStreamID)
	})

	connectionsByRole.volunteer.addConnection(event.context.user.netID, eventStreamID, eventStream)

	return eventStream.send()
})
