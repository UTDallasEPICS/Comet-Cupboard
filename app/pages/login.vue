<template>
	<section>
		<div class="flex flex-col items-center justify-center gap-6">
			<div class="text-center">
				<h1 class="text-3xl font-semibold">Comet Cupboard</h1>
				<p class="text-sm text-gray-500">Sign in with the EPICS SSO broker</p>
			</div>
			<UButton color="primary" size="xl" @click="startLogin"> Login with SSO </UButton>
		</div>
	</section>
</template>

<script lang="ts" setup>
const startLogin = async () => {
	await navigateTo("/api/public/auth/login", { external: true })
}
</script>
