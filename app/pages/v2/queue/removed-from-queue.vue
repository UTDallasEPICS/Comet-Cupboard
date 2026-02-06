<template>
	<div>
		<div class="mx-auto mt-20 md:max-w-[600px]">
			<!-- Message that will be displayed to the student who was removed from the queue: -->
			<div class="drop-shadow-standard mt-4 flex h-80 w-full items-center justify-center rounded-xl bg-white p-2 text-center">
				<p>You have been removed from the queue.<br />Please contact a volunteer if you believe this was a mistake.</p>
			</div>

			<!-- Sign Out button: if this button is pressed, then the student will be moved back to the login page -->
			<button @click="logout" class="bg-utd-orange mx-auto mt-3 block h-12 w-32 rounded-xl p-2 text-white">
				<p>Sign Out</p>
			</button>
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
