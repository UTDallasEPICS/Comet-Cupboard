<template>
	<SharedFormShell :validate="validate" :state="state" :on-submit="submit" :on-error="onError" width-class="w-full">
		<SharedLayoutSectionUCard title="Link Details">
			<div class="flex w-full flex-col gap-4">
				<UFormField name="displayName" label="Display Name" description="Enter the display name for the dashboard link" required>
					<UInput v-model="state.displayName" placeholder="Enter display name" class="w-full" />
				</UFormField>
				<UFormField name="url" label="URL" description="Enter the URL for the dashboard link (Must start with https://)" required>
					<UInput v-model="state.url" placeholder="Enter URL" class="w-full" />
				</UFormField>
				<UFormField name="description" label="Description" description="Enter the description for the dashboard link" required>
					<UInput v-model="state.description" placeholder="Enter description" class="w-full" />
				</UFormField>
			</div>
		</SharedLayoutSectionUCard>
		<SharedLayoutSectionUCard title="Placement">
			<div class="flex w-full flex-col gap-4">
				<UFormField name="dashboardRolePage" label="Dashboard Role Page" description="Select the dashboard role page for the link" required>
					<USelect v-model="state.dashboardRolePage" :items="roles" class="w-full" />
				</UFormField>
				<UFormField name="displayOrder" label="Display Order" description="Enter the display order for the dashboard link" required>
					<UInput v-model.number="state.displayOrder" type="number" :min="0" placeholder="Enter display order" class="w-full" />
				</UFormField>
			</div>
		</SharedLayoutSectionUCard>
		<SharedFormActions :submit-text="submitText" class-name="sticky right-4 bottom-8 mt-4" />
	</SharedFormShell>
</template>

<script setup lang="ts">
import { dashboardLinkSchema, type DashboardLinkForm } from "~/utils/formSchemas"

const roles = ["STUDENT", "VOLUNTEER", "ADMIN", "HEAD_ADMIN"] as const
const props = withDefaults(defineProps<{ initialValues?: Partial<DashboardLinkForm>; submitText?: string }>(), {
	initialValues: () => ({}),
	submitText: "Submit",
})
const emit = defineEmits<{ submit: [payload: DashboardLinkForm] }>()
const { state, validate, onError } = createFormBuilder(dashboardLinkSchema, () => props.initialValues)
watch(
	() => props.initialValues,
	(values) => Object.assign(state.value, values),
	{ deep: true }
)
const submit = (event: { data: DashboardLinkForm }) => emit("submit", event.data)
</script>
