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
						<UModal v-model:open="isDeleteModalOpen">
							<SharedButtonActionButton label="Delete Custom Link" color="error" variant="outline" icon="i-lucide-trash-2" />
							<template #content>
								<UCard>
									<SharedTextCardTitle>Confirm Deletion?</SharedTextCardTitle>
									<USeparator class="my-2" />
									<div class="mt-4 flex flex-row items-center justify-center gap-2">
										<SharedButtonActionButton action="cancel" text="Cancel" @click="isDeleteModalOpen = false" />
										<SharedButtonActionButton action="negative" text="Confirm Deletion" @click="deactivate(route.params.dashboardLinkID)" />
									</div>
								</UCard>
							</template>
						</UModal>
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

const isDeleteModalOpen = ref(false)

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
