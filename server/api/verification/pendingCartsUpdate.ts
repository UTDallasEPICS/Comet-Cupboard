import { volunteerMap } from "~/server/utils/cartVerificationUtil"

export default defineEventHandler(async (event) => {
	const eventStream = createEventStream(event)

	const interval = setInterval(async () => {
		await eventStream.push(`ping-pong`)
	}, 60000)

	eventStream.onClosed(async () => {
		clearInterval(interval)
		await eventStream.close()
		if (volunteerMap[event.context.netID]) {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete volunteerMap[event.context.netID]
		}
	})

	volunteerMap[event.context.netID] = eventStream

	return eventStream.send()
})
