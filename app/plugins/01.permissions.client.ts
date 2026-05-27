export default defineNuxtPlugin(async (nuxtApp) => {
	const permissionsStore = usePermissionsStore()
	await permissionsStore.setPermissionsFromServer()
})
