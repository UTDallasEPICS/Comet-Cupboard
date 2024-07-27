import { AccessLevel, pageAccessMap } from "~/permissions"

const canAccess = (routePermission: string, accessLevel: string): boolean => {
	switch (routePermission) {
		case AccessLevel.PUBLIC:
			return true
		case AccessLevel.STUDENT:
			return accessLevel == AccessLevel.STUDENT || accessLevel == AccessLevel.VOLUNTEER || accessLevel == AccessLevel.ADMIN
		case AccessLevel.VOLUNTEER:
			return accessLevel == AccessLevel.VOLUNTEER || accessLevel == AccessLevel.ADMIN
		case AccessLevel.ADMIN:
			return accessLevel == AccessLevel.ADMIN
		default:
			return false
	}
}

export default defineNuxtRouteMiddleware((to, from) => {
	const accessCookie = useCookie("accessLevel")
	// TODO, handle when navigating back to index page while logged in
	if (to.path == "/") {
		return
	}
	// do not have permission to access
	if (!(pageAccessMap[to.path] && accessCookie.value && canAccess(pageAccessMap[to.path], accessCookie.value))) {
		return navigateTo("/")
	}
})
