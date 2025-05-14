import { volunteerMap } from "~/server/utils/cartVerificationUtil"
import { nanoid } from "nanoid"

export default defineEventHandler(async (event) => {
	const eventStream = createEventStream(event)
	const eventStreamID = nanoid()

	const interval = setInterval(async () => {
		await eventStream.push(`ping-pong`)
	}, 60000)

	eventStream.onClosed(async () => {
		clearInterval(interval)
		await eventStream.close()
		if (volunteerMap[event.context.user.netID]) {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete volunteerMap[event.context.user.netID]
		}
	})

	if (!volunteerMap[event.context.user.netID]) {
		volunteerMap[event.context.user.netID] = {}
	}

	volunteerMap[event.context.user.netID][eventStreamID] = eventStream

	return eventStream.send()
})
