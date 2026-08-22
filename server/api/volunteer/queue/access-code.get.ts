import { getQueueAccessCode } from "#server/utils/queueAccessCode"
import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async () => {
	return { code: getQueueAccessCode(), expiresAt: (Math.floor(Date.now() / 60_000) + 1) * 60_000 }
})
