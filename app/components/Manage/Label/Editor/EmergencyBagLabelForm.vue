<template>
	<SharedFormShell :validate="validate" :state="state" :on-submit="submit" :on-error="onError" width-class="w-full">
		<SharedTextBaseSecondary v-if="props.emergencyBagLabelID" class="mb-4 block font-mono">Emergency Bag Label ID: {{ props.emergencyBagLabelID }}</SharedTextBaseSecondary>
		<UFormField name="emergencyBagLabelName" v-bind="emergencyBagLabelFormFields.emergencyBagLabelName" required>
			<UInput v-model="state.emergencyBagLabelName" :placeholder="emergencyBagLabelFormFields.emergencyBagLabelName.placeholder" class="w-full" />
		</UFormField>

		<UFormField name="color" v-bind="emergencyBagLabelFormFields.color" class="mt-4">
			<div class="flex flex-wrap items-center gap-3">
				<UColorPicker v-model="state.color" />
				<UInput v-model="state.color" placeholder="#000000" class="w-32" />
				<SharedLabel :label="state.emergencyBagLabelName || 'Example Label'" :color="state.color" :archived="state.archived" />
			</div>
		</UFormField>

		<UFormField name="archived" v-bind="emergencyBagLabelFormFields.archived" class="mt-4">
			<UCheckbox v-model="state.archived" :label="emergencyBagLabelFormFields.archived.label" />
		</UFormField>

		<SharedFormActions :submit-text="submitText" class-name="mt-4" />
	</SharedFormShell>
</template>

<script setup lang="ts">
import { emergencyBagLabelFormFields, emergencyBagLabelSchema, type EmergencyBagLabelForm } from "#shared/utils/formSchemas"

const props = withDefaults(
	defineProps<{
		emergencyBagLabelID?: string
		initialValues: EmergencyBagLabelForm
		submitText?: string
	}>(),
	{
		emergencyBagLabelID: undefined,
		submitText: "Save Label",
	}
)

const emit = defineEmits<{ submit: [payload: EmergencyBagLabelForm] }>()

const { state, validate, onError } = createFormBuilder(emergencyBagLabelSchema, () => props.initialValues)

watch(
	() => props.initialValues,
	(values) => Object.assign(state.value, values),
	{ deep: true }
)

const submit = (event: { data: EmergencyBagLabelForm }) => emit("submit", event.data)
</script>
