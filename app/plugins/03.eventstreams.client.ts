export default defineNuxtPlugin(async (nuxtApp) => {
	const { connectStudent } = useStudentEventStream()
	const { connectVolunteer } = useVolunteerEventStream()
	const permissionsStore = usePermissionsStore()

	if (permissionsStore.canStudentAccess) {
		connectStudent()
	}
	if (permissionsStore.canVolunteerAccess) {
		connectVolunteer()
	}
})
