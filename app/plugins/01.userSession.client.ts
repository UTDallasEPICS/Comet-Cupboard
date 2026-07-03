export default defineNuxtPlugin(async (nuxtApp) => {
	const permissionsStore = usePermissionsStore()
	await permissionsStore.setPermissionsFromServer()
	const userSessionStore = useUserSessionInfoStore()
	await userSessionStore.setUserSessionInfoFromServer()
})
