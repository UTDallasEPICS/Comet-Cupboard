import { userMap } from "~/server/utils/cartVerificationUtil"
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
		if (userMap[event.context.user.netID][eventStreamID]) {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete userMap[event.context.user.netID][eventStreamID]
		}
	})

	if (!userMap[event.context.user.netID]) {
		userMap[event.context.user.netID] = {}
	}

	userMap[event.context.user.netID][eventStreamID] = eventStream

	return eventStream.send()
})
