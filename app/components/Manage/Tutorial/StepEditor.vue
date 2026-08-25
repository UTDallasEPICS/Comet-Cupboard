<template>
	<UForm :validate="validate" :state="state" class="w-full space-y-4" @submit="onSubmit" @error="onError">
		<UCard>
			<div class="mb-4 flex items-center justify-between">
				<SharedTextCardTitle>Step {{ props.stepIndex }}</SharedTextCardTitle>
				<SharedButtonActionButton icon="i-lucide-x" color="error" variant="ghost" size="sm" @click="removeStep" />
			</div>
			<USeparator class="mb-4" />

			<UFormField id="image" name="image" label="Step Image" description="JPG or PNG. 2MB Max. Image should be 16:9 (for example 1200x675px)" required>
				<div class="flex flex-col gap-2">
					<UFileUpload
						v-model="state.image"
						class="aspect-square w-full"
						label="Upload image"
						accept=".jpg,.jpeg,.png"
						@update:model-value="handleImageChanged"
					/>
				</div>
			</UFormField>

			<UFormField id="description" name="description" label="Step Description" description="Describe what the user should do in this step" required>
				<UTextarea v-model="state.description" placeholder="Enter step description" class="w-full" />
			</UFormField>

			<div v-if="stepChanged" class="mt-4 flex justify-end gap-2">
				<SharedButtonActionButton action="cancel" text="Cancel" @click="cancelStepEdit" />
				<SharedButtonActionButton action="positive" type="submit" text="Save changes" />
			</div>
		</UCard>
	</UForm>
</template>

<script lang="ts" setup>
import * as z from "zod"

definePageMeta({ layout: false })

const props = defineProps({
	tutorialStepID: { type: String, required: true },
	tutorialID: { type: String, required: true },
	originalDescription: { type: String, required: true },
	originalImageURL: { type: String, required: false },
	stepIndex: { type: Number, required: true },
	isNewStep: { type: Boolean, required: true },
})

const emit = defineEmits(["stepChanged"])

const imageChanged = ref(false)
const descriptionChanged = ref(false)

const handleImageChanged = () => {
	imageChanged.value = true
}

const stepChanged = computed(() => imageChanged.value || descriptionChanged.value)

const originalImage = ref<Blob | null>(null)

const formSchema = imageSchema.extend({
	description: z.string().min(1, "Description is required"),
})

const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	image: originalImage.value ? new File([originalImage.value], props.originalImageURL, { type: originalImage.value!.type }) : undefined,
	description: props.originalDescription ?? "",
}))

watchEffect(async () => {
	if (props.originalImageURL) {
		originalImage.value = await $fetch<Blob>(`/api/public/image/${props.originalImageURL}`, { responseType: "blob" })
		state.value.image = new File([originalImage.value], props.originalImageURL, {
			type: originalImage.value.type,
		})
	} else {
		originalImage.value = null
	}
})

watchEffect(async () => {
	if (state.value.description !== props.originalDescription) {
		descriptionChanged.value = true
	} else {
		descriptionChanged.value = false
	}
})

const cancelStepEdit = () => {
	state.value.description = props.originalDescription
	if (props.originalImageURL) {
		state.value.image = new File([originalImage.value!], props.originalImageURL, { type: originalImage.value!.type })
	} else {
		state.value.image = undefined
	}
	imageChanged.value = false
	descriptionChanged.value = false
}

const onSubmit = async (event) => {
	try {
		const formData = new FormData()

		formData.append("tutorialID", props.tutorialID)
		formData.append("tutorialStepID", props.isNewStep ? "" : props.tutorialStepID)

		if (event.data.description !== undefined) {
			formData.append("description", event.data.description)
		}
		if (event.data.image !== undefined) {
			formData.append("image", event.data.image)
		}

		await $fetch("/api/admin/tutorial/tutorial/step", {
			method: "PUT",
			body: formData,
		})
		emit("stepChanged", { tutorialStepID: props.tutorialStepID })
	} catch (error) {
		// idk for now
	}
}

const removeStep = async () => {
	try {
		if (props.isNewStep == false) {
			await $fetch("/api/admin/tutorial/tutorial/step", {
				method: "DELETE",
				query: { tutorialStepID: props.tutorialStepID },
			})
		}

		emit("stepChanged", { tutorialStepID: props.tutorialStepID })
	} catch (error) {
		console.error("Failed to delete step:", error)
	}
}
</script>
