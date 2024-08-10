<template lang="pug">
div.flex.flex-row.items-center.justify-center
    form(@submit.prevent="handleSubmit")
        label NetID
        input.border-black.border-2(type="text" required v-model="netID")
</template>

<script lang="ts" setup>
const netID = ref("")

const handleSubmit = async () => {
	try {
		await $fetch("/api/login", {
			method: "POST",
			body: { netID: netID.value },
		})
		await navigateTo("/catalog")
	} catch (e) {
		/* lol */
	}
}
</script>
