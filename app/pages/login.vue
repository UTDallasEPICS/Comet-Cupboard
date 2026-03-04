<template>
	<section>
		<div class="flex flex-row items-center justify-center">
			<UForm :state="state" @submit="onSubmit">
				<UFormField label="Net ID" name="netID">
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

const permissions = usePermissionsStore()
const { setPermissionsFromServer } = permissions
const { canStudentAccess, canVolunteerAccess, canAdminAccess } = storeToRefs(permissions)

onMounted(async () => {
	await setPermissionsFromServer()
	if (canAdminAccess.value) {
		navigateTo("/admin")
	} else if (canVolunteerAccess.value) {
		navigateTo("/volunteer")
	} else if (canStudentAccess.value) {
		navigateTo("/student")
	}
})

const onSubmit = async () => {
	try {
		await $fetch("/api/public/account/login", {
			method: "POST",
			body: { netID: state.value.netID },
		})
		await setPermissionsFromServer()
		refreshCookie("netID")
		refreshCookie("AccessPermission")
		reloadNuxtApp()
	} catch (error) {
		const defaultErrorMessage = "An error occurred during login. Please try again."
		toast.add({ title: "Login Failed", description: error.data.data ?? defaultErrorMessage, color: "error" })
	}
}
</script>
