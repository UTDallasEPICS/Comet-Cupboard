<template>
	<SharedFormShell :validate="validate" :state="state" :on-submit="submit" :on-error="onError" width-class="w-full">
		<SharedFormCard>
			<div class="mb-4 flex items-center justify-between">
				<SharedTextCardTitle>Step {{ stepIndex }}</SharedTextCardTitle>
				<SharedButtonActionButton icon="i-lucide-x" action="negative" variant="ghost" size="sm" @click="remove" />
			</div>
			<USeparator class="mb-4" />

			<UFormField name="image" v-bind="tutorialStepFormFields.image" required>
				<UFileUpload
					v-model="state.image"
					class="aspect-square w-full"
					label="Upload image"
					accept=".jpg,.jpeg,.png"
					@update:model-value="imageChanged = true"
				/>
			</UFormField>

			<UFormField name="description" v-bind="tutorialStepFormFields.description" required>
				<UTextarea v-model="state.description" :placeholder="tutorialStepFormFields.description.placeholder" class="w-full" />
			</UFormField>

			<SharedFormActions v-if="stepChanged" submit-text="Save changes">
				<template #cancel>
					<SharedButtonActionButton action="cancel" text="Cancel" @click="reset" />
				</template>
			</SharedFormActions>
		</SharedFormCard>
	</SharedFormShell>
</template>

<script lang="ts" setup>
import { tutorialStepSchema, tutorialStepFormFields } from "#shared/utils/formSchemas"

const props = defineProps<{
	tutorialStepID: string
	tutorialID: string
	originalDescription: string
	originalImageURL?: string
	stepIndex: number
	isNewStep: boolean
}>()

const emit = defineEmits<{
	submit: [payload: FormData]
	remove: [tutorialStepID: string]
}>()

const imageChanged = ref(false)
const originalImage = ref<Blob | null>(null)

const { state, validate, onError } = createFormBuilder(tutorialStepSchema, () => ({
	image: undefined,
	description: props.originalDescription,
}))

const stepChanged = computed(() => imageChanged.value || state.value.description !== props.originalDescription)

watch(
	() => props.originalImageURL,
	async (imageURL) => {
		if (!imageURL) {
			originalImage.value = null
			return
		}

		originalImage.value = await $fetch<Blob>(`/api/public/image/${imageURL}`, { responseType: "blob" })
		state.value.image = new File([originalImage.value], imageURL, { type: originalImage.value.type })
	},
	{ immediate: true }
)

const reset = () => {
	state.value.description = props.originalDescription
	state.value.image =
		originalImage.value && props.originalImageURL ? new File([originalImage.value], props.originalImageURL, { type: originalImage.value.type }) : undefined
	imageChanged.value = false
}

const submit = () => {
	const payload = new FormData()
	payload.append("tutorialID", props.tutorialID)
	payload.append("tutorialStepID", props.isNewStep ? "" : props.tutorialStepID)
	payload.append("description", String(state.value.description ?? ""))
	if (state.value.image) {
		payload.append("image", state.value.image)
	}
	emit("submit", payload)
}

const remove = () => {
	emit("remove", props.tutorialStepID)
}
</script>
