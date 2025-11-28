<template lang="pug">
//- Page for if the student is denied access to the Comet Cupboard
div
    div(class="w-11/12 lg_w-6/12").mx-auto
            
        //- Message that will be displayed to the student who was denied access:
        div.w-full.rounded-lg.bg-white.font-montserrat.flex.items-center.justify-center.mx-auto.rounded-xl.text-center.text-md.sm_text-3xl.h-80.lg_h-96.mt-4.drop-shadow-standard.p-2.font-bold
            p You have been denied access to the Comet Cupboard.
        
        //- Sign Out button: if this button is pressed, then the student will be moved back to the login page
        button(class="bg-[#e87500]" @click="logout").flex.items-center.justify-center.text-base.sm_text-xl.font-semibold.font-montserrat.text-white.rounded-xl.w-32.sm_w-52.p-2.h-11.sm_h-16.mx-auto.remove-button-effects.mb-2.mt-3.lg_mt-8
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

	await reloadNuxtApp()

	await navigateTo("/")
}
</script>
