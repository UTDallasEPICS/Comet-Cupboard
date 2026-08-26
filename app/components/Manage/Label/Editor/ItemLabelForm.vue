<template>
	<SharedFormShell :validate="validate" :state="state" :on-submit="submit" :on-error="onError" width-class="w-full">
		<UFormField name="itemLabelName" v-bind="itemLabelFormFields.itemLabelName" required>
			<UInput v-model="state.itemLabelName" :placeholder="itemLabelFormFields.itemLabelName.placeholder" class="w-full" />
		</UFormField>

		<UFormField name="color" v-bind="itemLabelFormFields.color" class="mt-4">
			<div class="flex flex-wrap items-center gap-3">
				<UColorPicker v-model="state.color" />
				<UInput v-model="state.color" placeholder="#000000" class="w-32" />
				<SharedLabel :label="state.itemLabelName || 'Example Label'" :color="state.color" :archived="state.archived" />
			</div>
		</UFormField>

		<UFormField name="archived" v-bind="itemLabelFormFields.archived" class="mt-4">
			<UCheckbox v-model="state.archived" :label="itemLabelFormFields.archived.label" />
		</UFormField>

		<SharedFormActions :submit-text="submitText" class-name="mt-4" />
	</SharedFormShell>
</template>

<script setup lang="ts">
import { itemLabelFormFields, itemLabelSchema, type ItemLabelForm } from "#shared/utils/formSchemas"

const props = withDefaults(
	defineProps<{
		initialValues: ItemLabelForm
		submitText?: string
	}>(),
	{
		submitText: "Save Label",
	}
)

const emit = defineEmits<{ submit: [payload: ItemLabelForm] }>()

const { state, validate, onError } = createFormBuilder(itemLabelSchema, () => props.initialValues)

watch(
	() => props.initialValues,
	(values) => Object.assign(state.value, values),
	{ deep: true }
)

const submit = (event: { data: ItemLabelForm }) => emit("submit", event.data)
</script>
