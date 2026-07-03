<template>
	<section>
		<div class="flex flex-row items-center justify-center">
			<UForm :state="state" @submit="onSubmit">
				<UFormField label="Volunteer Net ID" name="userID">
					<UInput v-model="state.userID" required placeholder="Net ID" color="neutral" size="xl" />
				</UFormField>
			</UForm>
		</div>
	</section>
</template>

<script lang="ts" setup>
const toast = useToast()

const state = ref({
	userID: "",
})

const permissionsStore = usePermissionsStore()
const userSessionStore = useUserSessionInfoStore()

onMounted(async () => {
	await permissionsStore.setPermissionsFromServer()
	await userSessionStore.setUserSessionInfoFromServer()
	if (permissionsStore.canAdminAccess) {
		navigateTo("/admin")
	} else if (permissionsStore.canVolunteerAccess) {
		navigateTo("/volunteer")
	} else if (permissionsStore.canStudentAccess) {
		navigateTo("/student")
	}
})

const onSubmit = async () => {
	try {
		await $fetch("/api/public/account/login", {
			method: "POST",
			body: { userID: state.value.userID },
		})
		await permissionsStore.setPermissionsFromServer()
		await userSessionStore.setUserSessionInfoFromServer()
		refreshCookie("userID")
		refreshCookie("AccessPermission")

		await $fetch("/api/student/user/requestVolunteer", {
			method: "POST",
		})
	} catch (error) {
		toast.add({ title: "Error during login", description: error.data.data, color: "error" })
	}
	// TODO: this will be proper SSO later
	reloadNuxtApp()
}
</script>
