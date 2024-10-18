import { pageAccessMap } from "~/permissions"

export default defineNuxtRouteMiddleware((to, from) => {
	const accessCookie = useCookie("AccessPermission")
	const permissions = accessCookie.value

	// TODO, handle when navigating back to index page while logged in
	if (to.path == "/") {
		return
	}

	// page does not exist in pageAccessMap
	if (!pageAccessMap[to.path]) {
		return navigateTo("/")
	}
	// do not have permission to access
	const requiredAccessPermission: string = pageAccessMap[to.path]
	if (!(permissions && typeof(permissions) === 'object' && permissions[requiredAccessPermission])) {
		return navigateTo("/")
	}
})
