<template>
	<SharedFormShell :validate="validate" :state="state" :on-submit="submit" :on-error="onError" width-class="w-full">
		<SharedLayoutSectionUCard title="Tutorial Details">
			<UFormField name="name" v-bind="tutorialNameFormFields.name" required>
				<UInput v-model="state.name" :placeholder="tutorialNameFormFields.name.placeholder" class="w-full" />
			</UFormField>
		</SharedLayoutSectionUCard>
		<SharedFormActions submit-text="Submit" class-name="sticky right-4 bottom-8 mt-4" />
	</SharedFormShell>
</template>
<script setup lang="ts">
import { tutorialNameSchema, tutorialNameFormFields, type TutorialNameForm } from "~/utils/formSchemas"
const emit = defineEmits<{ submit: [tutorialName: string] }>()
const { state, validate, onError } = createFormBuilder(tutorialNameSchema, () => ({ name: "" }))
const submit = (event: { data: TutorialNameForm }) => emit("submit", event.data.name)
</script>
