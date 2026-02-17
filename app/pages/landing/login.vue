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
const state = ref({
	netID: "",
})

const permissions = usePermissionsStore()
const { setPermissionsFromServer } = permissions
const { canStudentAccess, canVolunteerAccess, canAdminAccess } = storeToRefs(permissions)

onMounted(async () => {
	await setPermissionsFromServer()
	if (canAdminAccess.value) {
		navigateTo("/landing/admin")
	} else if (canVolunteerAccess.value) {
		navigateTo("/landing/volunteer")
	} else if (canStudentAccess.value) {
		navigateTo("/landing/student")
	}
})

const onSubmit = async () => {
	try {
		await $fetch("/api/login", {
			method: "POST",
			body: { netID: state.value.netID },
		})
		await setPermissionsFromServer()
		refreshCookie("netID")
		refreshCookie("AccessPermission")
		reloadNuxtApp()
	} catch (e) {
		/* lol */
	}
}
</script>
