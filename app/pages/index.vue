<template>
	<div class="flex flex-row items-center justify-center">
		<UForm :state="state" @submit="onSubmit">
			<UFormField label="Net ID" name="netID">
				<UInput v-model="state.netID" required placeholder="Net ID" color="neutral" size="xl" />
			</UFormField>
		</UForm>
	</div>
</template>

<script lang="ts" setup>
const state = ref({
	netID: "",
})

const accessCookie = useCookie("netID")

onMounted(async () => {
	if (accessCookie.value) {
		await $fetch("/api/updatePermissions", {
			method: "GET",
		})
		const accessCookiePermission = useCookie("AccessPermission")
		const permissions = accessCookiePermission.value && typeof accessCookiePermission.value === "object" ? accessCookiePermission.value : {}
		if (!permissions["SHOPPING"]) {
			//Enters the student into the queue
			try {
				await $fetch("/api/queue", {
					method: "POST",
				})
			} catch (err) {
				//We don't care about this error, we just don't want this to stop us though
			}
			await navigateTo("/v2/queue")
		} else {
			await navigateTo("/v2/shopping")
		}
	}
})

const onSubmit = async () => {
	try {
		await $fetch("/api/login", {
			method: "POST",
			body: { netID: state.value.netID },
		})
		await $fetch("/api/updatePermissions", {
			method: "GET",
		})
		refreshCookie("netID")
		refreshCookie("AccessPermission")
		reloadNuxtApp()
	} catch (e) {
		/* lol */
	}
}
</script>
