<template>
	<UCard>
		<SharedTextSectionTitle> Volunteer Requests </SharedTextSectionTitle>
		<div class="flex flex-col gap-y-2 mt-4">
			<div v-for="pendingRequest in pendingVolunteerRequests" :key="pendingRequest.publicCode">
				<div class="flex flex-row items-center justify-between">
					<UUser :name="pendingRequest.publicCode" :avatar="{ icon: pendingRequest.publicIcon }" size="xl" />
					<UDropdownMenu
						:items="[
							{ label: 'Accept', onClick: () => approveVolunteerRequest(pendingRequest) },
							{ label: 'Reject', onClick: () => rejectVolunteerRequest(pendingRequest) },
						]"
					>
						<UButton :icon="icons['ellipsesActions']" variant="ghost" class="h-8 w-8" />
					</UDropdownMenu>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const { data: pendingVolunteerRequests, refresh } = await useFetch("/api/admin/user/pendingVolunteerRequests", {
	method: "GET",
})

const approveVolunteerRequest = async (pendingRequest) => {
	try {
		await $fetch("/api/admin/user/volunteerRequestAction", {
			method: "POST",
			body: {
				publicCode: pendingRequest.publicCode,
				action: "ACCEPT",
			},
		})
		await refresh()
	} catch (e) {}
}
const rejectVolunteerRequest = async (pendingRequest) => {
	try {
		await $fetch("/api/admin/user/volunteerRequestAction", {
			method: "POST",
			body: {
				publicCode: pendingRequest.publicCode,
				action: "REJECT",
			},
		})
		await refresh()
	} catch (e) {}
}
</script>
