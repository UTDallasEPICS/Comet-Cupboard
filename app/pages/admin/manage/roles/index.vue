<template>
	<div>
		<NuxtLayout name="main" title="Manage Roles" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }" :refresh-page-timer="60">
			<section>
				<ManageRolesPendingVolunteerRequests />
			</section>

			<section>
				<ManageRolesWorkerList class="mt-4" />
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })
</script>
