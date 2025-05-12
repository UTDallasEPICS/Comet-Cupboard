import { queueMap } from "~/server/utils/queueVerificationUtil"

export default defineEventHandler(async (event) => {
	const eventStream = createEventStream(event)

	const interval = setInterval(async () => {
		await eventStream.push(`awake`)
	}, 60000)

	eventStream.onClosed(async () => {
		clearInterval(interval)
		await eventStream.close()
		if (queueMap[event.context.user.netID]) {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete queueMap[event.context.user.netID]
		}
	})

	queueMap[event.context.user.netID] = eventStream

	return eventStream.send()
})
