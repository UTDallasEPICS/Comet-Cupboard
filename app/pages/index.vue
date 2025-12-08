<template lang="pug">
div.flex.flex-row.items-center.justify-center
	form(@submit.prevent="handleSubmit")
		label NetID
		input(required type="text" v-model="netID").border-black.border-2
</template>

<script lang="ts" setup>
const netID = ref("")

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
			await navigateTo("/queue")
		} else {
			await navigateTo("/v2/shopping")
		}
	}
})

const handleSubmit = async () => {
	try {
		await $fetch("/api/login", {
			method: "POST",
			body: { netID: netID.value },
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
