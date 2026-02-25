export default defineNuxtPlugin(async (nuxtApp) => {
	const { setPermissionsFromServer } = usePermissionsStore()
	await setPermissionsFromServer()
})
