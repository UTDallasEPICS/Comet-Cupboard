<template>
	<SharedFormShell :validate="validate" :state="state" :on-submit="submit" :on-error="onError" width-class="w-full">
		<SharedLayoutSectionUCard title="Tutorial Details">
			<UFormField name="tutorialName" v-bind="tutorialNameFormFields.tutorialName" required>
				<UInput v-model="state.tutorialName" :placeholder="tutorialNameFormFields.tutorialName.placeholder" class="w-full" />
			</UFormField>
		</SharedLayoutSectionUCard>
		<SharedFormActions submit-text="Submit" class-name="sticky right-4 bottom-8 mt-4" />
	</SharedFormShell>
</template>
<script setup lang="ts">
import { tutorialNameSchema, tutorialNameFormFields, type TutorialNameForm } from "#shared/utils/formSchemas"
const emit = defineEmits<{ submit: [tutorialName: string] }>()
const { state, validate, onError } = createFormBuilder(tutorialNameSchema, () => ({ tutorialName: "" }))
const submit = (event: { data: TutorialNameForm }) => emit("submit", event.data.tutorialName)
</script>
