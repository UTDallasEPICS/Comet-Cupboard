<template lang="pug">
div.flex.flex-col.items-center.justify-center.text-bold.font-bold.h-full.text-center
	div.text-4xl
		| You are no longer in line to enter the comet cupboard.
	div.mt-5.text-2xl
		| If you would like to rejoin the line, please return to the comet cupboard to access the site again.
</template>
<script lang="ts" setup>
const accessCookie = ref(useCookie("AccessPermission"))
const permissions = ref(accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {})

//We want to simulate an entire logout process if this is true
onMounted(async () => {
	try {
		await $fetch("/api/cart/cart", {
			method: "DELETE",
		})
	} catch (err) {
		//We don't care about this error, we just don't want this to stop us though
	}

	const netIDCookie = useCookie("netID")
	netIDCookie.value = null
	permissions.value = accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {}
})
</script>
