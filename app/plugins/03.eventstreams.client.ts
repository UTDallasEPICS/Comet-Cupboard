import { useStudentEventStream } from "../composables/useStudentEventStream"

export default defineNuxtPlugin(async (nuxtApp) => {
	const { connectStudent } = useStudentEventStream()
	const { connectVolunteer } = useVolunteerEventStream()
	const permissions = usePermissionsStore()
	const { canStudentAccess, canVolunteerAccess } = storeToRefs(permissions)

	if (canStudentAccess.value) {
		connectStudent()
	}
	if (canVolunteerAccess.value) {
		connectVolunteer()
	}
})
