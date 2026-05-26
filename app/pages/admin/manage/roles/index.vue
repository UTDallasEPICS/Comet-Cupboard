<template>
	<UContainer class="py-8">
		<header class="relative mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div class="sm:absolute sm:left-0">
				<SharedButtonNavigateBack text="Back" :to="{ path: '/admin' }" />
			</div>

			<div class="w-full text-center">
				<SharedTextPageTitle>Manage Roles</SharedTextPageTitle>
			</div>

			<div class="flex flex-col items-center gap-2 sm:absolute sm:right-0 sm:flex-row sm:gap-3">
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
