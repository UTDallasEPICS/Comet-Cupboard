<template>
	<div>
		<NuxtLayout
			name="main"
			title="Edit Custom Dashboard Link"
			:back-navigation="{ text: 'Back to Custom Dashboard Links', to: '/head-admin/dashboard-links' }"
		>
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto w-full max-w-xl">
					<div class="flex w-full flex-row items-center justify-center">
						<SharedConfirmationModal title="Confirm Deletion?" confirm-text="Confirm Deletion" @confirm="deactivate(route.params.dashboardLinkID)">
							<SharedButtonActionButton text="Delete Custom Link" action="negative" variant="outline" leading-icon="i-lucide-trash-2" />
						</SharedConfirmationModal>
					</div>

					<ManageDashboardLinkEditorLinkForm class="mt-4" :initial-values="current" submit-text="Save changes" @submit="onSubmit" />
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>
<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()

const { data: links } = await useFetch("/api/head-admin/dashboard-links/dashboard-link/links")
const current = computed(() => links.value?.find((link) => link.dashboardLinkID === route.params.dashboardLinkID))

const onSubmit = async (data: { displayName: string; url: string; description: string; dashboardRolePage: string; displayOrder: number }) => {
	await $fetch("/api/head-admin/dashboard-links/dashboard-link", {
		method: "PUT",
		body: { ...data, dashboardLinkID: String(route.params.dashboardLinkID) },
	})
	await navigateTo("/head-admin/dashboard-links")
}

const deactivate = async (dashboardLinkID: string) => {
	await $fetch("/api/head-admin/dashboard-links/dashboard-link", {
		method: "DELETE",
		query: { dashboardLinkID },
	})
	await navigateTo("/head-admin/dashboard-links")
}
</script>
