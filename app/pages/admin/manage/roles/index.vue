<template>
	<UContainer class="py-8">
		<header class="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">

			<div class="sm:absolute sm:left-0">
				<SharedButtonNavigateBack text="Back" :to="{ path: '/admin' }" />

				<UButton 
				icon="i-heroicons-question-mark-circle" 
				color="gray" 
				variant="ghost" 
				label="Take a Tour" 
				@click="startTour" 
			/>
			</div>


			<div class="w-full text-center">
          		<SharedTextPageTitle>Manage Roles</SharedTextPageTitle>
        	</div>

        	<div class="flex flex-col items-center gap-2 sm:flex-row sm:absolute sm:right-0 sm:gap-3" id = "refresh">
				<SharedTextBaseSecondary>Auto refresh in {{ countdown }}</SharedTextBaseSecondary>

				<UButton size="xs" variant="soft" :icon="icons['refresh']" @click="refreshNow"> Refresh now </UButton>
			</div>
		</header>

		<section class="mt-4" id = "manage-pending-requests">
			<ManageRolesPendingVolunteerRequests />
		</section>

		<section class="mt-4" id = "manage-roles">
			<ManageRolesWorkerList />
		</section>
	</UContainer>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"; 

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

const { startTour } = ManageRolesTour()


onMounted(() => {
	startTour();
});
</script>
