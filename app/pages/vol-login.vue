<template>
	<section>
		<div class="flex flex-row items-center justify-center">
			<UForm :state="state" @submit="onSubmit">
				<UFormField label="Volunteer Net ID" name="netID">
					<UInput v-model="state.netID" required placeholder="Net ID" color="neutral" size="xl" />
				</UFormField>
			</UForm>
		</div>
	</section>
</template>

<script lang="ts" setup>
const toast = useToast()

const state = ref({
	netID: "",
})

const permissionsStore = usePermissionsStore()

onMounted(async () => {
	await permissionsStore.setPermissionsFromServer()
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
			body: { netID: state.value.netID },
		})
		await permissionsStore.setPermissionsFromServer()
		refreshCookie("netID")
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
