<template>
	<div>
		<NuxtLayout
			name="main"
			title="Add Custom Dashboard Link"
			:back-navigation="{ text: 'Back to Custom Dashboard Links', to: '/head-admin/dashboard-links' }"
		>
			<USeparator class="my-4" />
			<div class="mx-auto w-full max-w-xl">
				<UForm :validate="validate" :state="state" class="w-full space-y-4" @submit="onSubmit" @error="onError">
					<SharedLayoutSectionUCard title="Link Details">
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
							<UFormField id="url" name="url" label="URL" description="Enter the URL for the dashboard link (Must start with https://)" required>
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
					</SharedLayoutSectionUCard>
					<SharedLayoutSectionUCard title="Placement">
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
					</SharedLayoutSectionUCard>

					<footer class="sticky right-4 bottom-8 mt-4 flex justify-end space-x-2 sm:ml-auto">
						<SharedButtonActionButton action="positive" type="submit" text="Submit" />
					</footer>
				</UForm>
			</div>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
import * as z from "zod"

definePageMeta({ layout: false })

const roles = ref(["STUDENT", "VOLUNTEER", "ADMIN", "HEAD_ADMIN"])

const route = useRoute()
const prefill = computed(() => {
	const audience = route.query.audience

	if (typeof audience === "string" && roles.value.includes(audience)) {
		return audience
	}

	return undefined
})
const formSchema = z.object({
	displayName: z.string().trim().min(1),
	url: z.url({
		protocol: /^https?$/,
		hostname: z.regexes.domain,
	}),
	description: z.string(),
	dashboardRolePage: z.enum(roles.value),
	displayOrder: z.number().int().min(0),
})

const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	displayName: undefined,
	url: undefined,
	description: undefined,
	dashboardRolePage: prefill.value ?? undefined,
	displayOrder: undefined,
}))

const onSubmit = async (event) => {
	try {
		const payload = {
			dashboardLinkID: "",
			displayName: event.data.displayName,
			url: event.data.url,
			description: event.data.description,
			dashboardRolePage: event.data.dashboardRolePage,
			displayOrder: event.data.displayOrder,
		}

		await $fetch("/api/head-admin/dashboard-links/dashboard-link", {
			method: "PUT",
			body: payload,
		})
		navigateTo("/head-admin/dashboard-links")
	} catch (error) {
		// idk for now
	}
}
</script>
