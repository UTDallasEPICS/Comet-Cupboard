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
							<UButton label="Delete Custom Link" color="error" variant="outline" :icon="icons['delete']" />
							<template #content>
								<UCard>
									<SharedTextCardTitle>Confirm Deletion?</SharedTextCardTitle>
									<USeparator class="my-2" />
									<div class="mt-4 flex flex-row items-center justify-center gap-2">
										<SharedButtonCancel text="Cancel" @click="isDeleteModalOpen = false" />
										<SharedButtonNegativeAction text="Confirm Deletion" @click="deactivate(route.params.dashboardLinkID)" />
									</div>
								</UCard>
							</template>
						</UModal>
					</div>

					<UForm :validate="validate" :state="state" class="mt-4 w-full space-y-4" @submit="onSubmit" @error="onError">
						<UCard>
							<SharedTextCardTitle>Link Details</SharedTextCardTitle>
							<USeparator class="my-4" />
							<div class="flex w-full flex-col gap-4">
								<UFormField
									id="displayName"
									name="displayName"
									label="Display Name"
									description="Enter the display name for the dashboard link"
									required
								>
									<UInput v-model="state.displayName" placeholder="Enter display name" class="w-full" />
								</UFormField>
								<UFormField
									id="url"
									name="url"
									label="URL"
									description="Enter the URL for the dashboard link (Must start with https://)"
									required
								>
									<UInput v-model="state.url" placeholder="Enter URL" class="w-full" />
								</UFormField>
								<UFormField
									id="description"
									name="description"
									label="Description"
									description="Enter the description for the dashboard link"
									required
								>
									<UInput v-model="state.description" placeholder="Enter description" class="w-full" />
								</UFormField>
							</div>
						</UCard>
						<UCard>
							<SharedTextCardTitle>Placement</SharedTextCardTitle>
							<USeparator class="my-4" />
							<div class="flex w-full flex-col gap-4">
								<UFormField
									id="dashboardRolePage"
									name="dashboardRolePage"
									label="Dashboard Role Page"
									description="Select the dashboard role page for the link"
									required
								>
									<USelect v-model="state.dashboardRolePage" :items="roles" class="w-full" />
								</UFormField>

								<UFormField
									id="displayOrder"
									name="displayOrder"
									label="Display Order"
									description="Enter the display order for the dashboard link"
									required
								>
									<UInput v-model.number="state.displayOrder" type="number" :min="0" placeholder="Enter display order" class="w-full" />
								</UFormField>
							</div>
						</UCard>
						<footer class="flex justify-end"><SharedButtonPositiveAction type="submit" text="Save changes" /></footer>
					</UForm>
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>
<script setup lang="ts">
import * as z from "zod"
definePageMeta({ layout: false })

const route = useRoute()
const roles = ["STUDENT", "VOLUNTEER", "ADMIN", "HEAD_ADMIN"]

const isDeleteModalOpen = ref(false)

const formSchema = z.object({
	displayName: z.string().trim().min(1),
	url: z
		.string()
		.trim()
		.refine((value) => value.startsWith("/") || URL.canParse(value), "Enter a valid URL"),
	description: z.string(),
	dashboardRolePage: z.enum(["STUDENT", "VOLUNTEER", "ADMIN", "HEAD_ADMIN"]),
	displayOrder: z.number().int().min(0),
})

const { data: links } = await useFetch("/api/head-admin/dashboard-links/dashboard-link/links")
const current = computed(() => links.value?.find((link) => link.dashboardLinkID === route.params.dashboardLinkID))
const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	displayName: current.value?.displayName ?? undefined,
	url: current.value?.url ?? undefined,
	description: current.value?.description ?? undefined,
	dashboardRolePage: current.value?.dashboardRolePage ?? undefined,
	displayOrder: current.value?.displayOrder ?? undefined,
}))

const onSubmit = async (event) => {
	await $fetch("/api/head-admin/dashboard-links/dashboard-link", {
		method: "PUT",
		body: { ...event.data, dashboardLinkID: String(route.params.dashboardLinkID) },
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
