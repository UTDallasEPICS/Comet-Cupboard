<template>
	<UContainer class="py-8">
		<header class="flex items-center justify-between">
			<SharedButtonNavigateBack text="Back to Dashboard" :to="{ path: '/admin' }" />
			<SharedTextPageTitle>Manage Roles</SharedTextPageTitle>

			<div class="flex items-center gap-3">
				<SharedTextBaseSecondary>Auto refresh in {{ countdown }}</SharedTextBaseSecondary>

				<UButton size="xs" variant="soft" :icon="icons['refresh']" @click="refreshNow"> Refresh now </UButton>
			</div>
		</header>

		<section class="mt-4">
			<ManageRolesPendingVolunteerRequests />
		</section>

		<section class="mt-4">
			<ManageRolesWorkerList />
		</section>
	</UContainer>
</template>

<script lang="ts" setup>
const countdown = ref(60)
let interval

const refreshNow = () => {
	reloadNuxtApp()
}

onMounted(() => {
	interval = setInterval(() => {
		countdown.value--

		if (countdown.value <= 0) {
			refreshNow()
			countdown.value = 60
		}
	}, 1000)
})

onBeforeUnmount(() => {
	clearInterval(interval)
})
</script>
