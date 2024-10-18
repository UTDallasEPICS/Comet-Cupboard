export default defineEventHandler(async (event) => {
	setCookie(event, "AccessPermission", JSON.stringify(event.context.permissions))
})
