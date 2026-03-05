import { defineSafeHandler } from "#server/utils/handler"

export default defineSafeHandler(async (event) => {
	setCookie(event, "AccessPermission", JSON.stringify(event.context.permissions))
	return `Successfully updated permissions: ${JSON.stringify(event.context.permissions)}`
})
