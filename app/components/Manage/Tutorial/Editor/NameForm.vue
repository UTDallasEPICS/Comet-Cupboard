<template>
	<SharedFormShell :validate="validate" :state="state" :on-submit="submit" :on-error="onError" width-class="w-full">
		<SharedLayoutSectionUCard title="Tutorial Details">
			<UFormField name="tutorialName" v-bind="tutorialNameFormFields.tutorialName" required>
				<UInput v-model="state.tutorialName" :placeholder="tutorialNameFormFields.tutorialName.placeholder" class="w-full" />
			</UFormField>
			<SharedFormActions v-if="changesMade" submit-text="Save changes">
				<template #cancel>
					<SharedButtonActionButton action="cancel" text="Cancel" @click="reset" />
				</template>
			</SharedFormActions>
		</SharedLayoutSectionUCard>
	</SharedFormShell>
</template>

<script lang="ts" setup>
import { tutorialNameSchema, tutorialNameFormFields } from "#shared/utils/formSchemas"

const props = defineProps<{ originalName: string }>()

const emit = defineEmits<{ submit: [tutorialName: string] }>()

const { state, validate, onError } = createFormBuilder(tutorialNameSchema, () => ({
	tutorialName: props.originalName,
}))

const changesMade = computed(() => state.value.tutorialName !== props.originalName)

const reset = () => {
	state.value.tutorialName = props.originalName
}

const submit = () => {
	emit("submit", state.value.tutorialName)
}
</script>
