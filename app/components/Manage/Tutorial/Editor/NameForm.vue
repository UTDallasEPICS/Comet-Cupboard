<template>
	<SharedFormShell :validate="validate" :state="state" :on-submit="submit" :on-error="onError" width-class="w-full">
		<SharedLayoutSectionUCard title="Tutorial Details">
			<UFormField
				id="name"
				name="name"
				label="Tutorial Name"
				description="Tutorial name must be at most 30 characters and only contain letters and spaces"
				required
			>
				<UInput v-model="state.name" placeholder="Enter new tutorial name" class="w-full" />
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
import { tutorialNameSchema } from "~/utils/formSchemas"

const props = defineProps<{ originalName: string }>()

const emit = defineEmits<{ submit: [tutorialName: string] }>()

const { state, validate, onError } = createFormBuilder(tutorialNameSchema, () => ({
	name: props.originalName,
}))

const changesMade = computed(() => state.value.name !== props.originalName)

const reset = () => {
	state.value.name = props.originalName
}

const submit = () => {
	emit("submit", state.value.name)
}
</script>
