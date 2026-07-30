import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	return event.context.permissions
})
