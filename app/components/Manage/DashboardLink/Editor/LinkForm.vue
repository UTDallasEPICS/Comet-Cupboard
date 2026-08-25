<template>
	<SharedFormShell :validate="validate" :state="state" :on-submit="submit" :on-error="onError" width-class="w-full">
		<SharedLayoutSectionUCard title="Link Details">
			<div class="flex w-full flex-col gap-4">
				<UFormField name="displayName" v-bind="dashboardLinkFormFields.displayName" required>
					<UInput v-model="state.displayName" :placeholder="dashboardLinkFormFields.displayName.placeholder" class="w-full" />
				</UFormField>
				<UFormField name="url" v-bind="dashboardLinkFormFields.url" required>
					<UInput v-model="state.url" :placeholder="dashboardLinkFormFields.url.placeholder" class="w-full" />
				</UFormField>
				<UFormField name="description" v-bind="dashboardLinkFormFields.description" required>
					<UInput v-model="state.description" :placeholder="dashboardLinkFormFields.description.placeholder" class="w-full" />
				</UFormField>
			</div>
		</SharedLayoutSectionUCard>
		<SharedLayoutSectionUCard title="Placement">
			<div class="flex w-full flex-col gap-4">
				<UFormField name="dashboardRolePage" v-bind="dashboardLinkFormFields.dashboardRolePage" required>
					<USelect v-model="state.dashboardRolePage" :items="roles" class="w-full" />
				</UFormField>
				<UFormField name="displayOrder" v-bind="dashboardLinkFormFields.displayOrder" required>
					<UInput
						v-model.number="state.displayOrder"
						type="number"
						:min="0"
						:placeholder="dashboardLinkFormFields.displayOrder.placeholder"
						class="w-full"
					/>
				</UFormField>
			</div>
		</SharedLayoutSectionUCard>
		<SharedFormActions :submit-text="submitText" class-name="sticky right-4 bottom-8 mt-4" />
	</SharedFormShell>
</template>

<script setup lang="ts">
import { dashboardLinkSchema, dashboardLinkFormFields, type DashboardLinkForm } from "~/utils/formSchemas"

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
