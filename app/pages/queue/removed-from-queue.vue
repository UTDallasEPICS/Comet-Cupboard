<template>
	<div class="p-4">
		<UCard class="flex h-80 items-center justify-center text-center">
			<p>You have been removed from the queue.</p>
			<p>Please contact a volunteer if you believe this was a mistake.</p>
		</UCard>

		<div class="mt-4 flex justify-center">
			<UButton color="primary" size="lg" @click="logout"> Sign Out </UButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
// Moves the student back to the login page.
const logout = async () => {
	reloadNuxtApp()

	await navigateTo("/")
}
</script>
