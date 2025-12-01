<template lang="pug">
//- Removed From Queue Access Page: Page for if the student is removed from the queue
div
	//- Header for the Removed From Queue Access page.
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(pageTitle="Removed From Queue")(class="md_max-w-[600px]").md_rounded-b-xl
	
	div(class="md_max-w-[600px]").mx-auto.mt-20
		//- Message that will be displayed to the student who was removed from the queue:
		div.w-full.rounded-lg.bg-white.flex.items-center.rounded-xl.text-center.h-80.mt-4.drop-shadow-standard.p-2.font-semibold
			p You have been removed from the queue. Please contact a volunteer if you believe this was a mistake.

		//- Sign Out button: if this button is pressed, then the student will be moved back to the login page
		button(@click="logout").bg-utd-orange.block.font-semibold.text-white.rounded-xl.w-32.h-12.p-2.mx-auto.mt-3
			p Sign Out
</template>

<script lang="ts" setup>
// Moves the student back to the login page.
const logout = async () => {
	try {
		await $fetch("/api/cart/cart", {
			method: "DELETE",
		})
	} catch (err) {
		// We don't care about this error, we just don't want this to stop us though
	}

	const netIDCookie = useCookie("netID")
	const accessCookie = useCookie("AccessPermission")
	netIDCookie.value = null
	accessCookie.value = null

	reloadNuxtApp()

	await navigateTo("/")
}
</script>
