<template>
	<UForm :validate="validate" :state="state" class="w-96 space-y-4" @submit="onSubmit" @error="onError">
		<UCard>
			<div class="mb-4 flex items-center justify-between">
				<SharedTextBase class="font-semibold"> Step {{ props.stepIndex }} </SharedTextBase>
				<UButton icon="i-lucide-x" color="error" variant="ghost" size="sm" @click="removeStep" />
			</div>

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
				<SharedButtonCancel text="Cancel" @click="cancelStepEdit" />
				<SharedButtonPositiveAction type="submit" text="Save changes" />
			</div>
		</UCard>
	</UForm>
</template>

<script lang="ts" setup>
import * as z from "zod"

definePageMeta({ layout: false })

const props = defineProps({
	stepID: { type: String, required: true },
	pageID: { type: String, required: true },
	originalDescription: { type: String, required: true },
	originalImageURL: { type: String, required: false },
	stepIndex: { type: Number, required: true },
	isNewStep: { type: Boolean, required: true },
})

console.log(props)

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

		if (props.isNewStep == true) {
			formData.append("pageID", props.pageID)
		} else {
			formData.append("id", props.stepID)
		}

		if (event.data.description !== undefined) {
			formData.append("description", event.data.description)
		}
		if (event.data.image !== undefined) {
			formData.append("image", event.data.image)
		}

		if (props.isNewStep) {
			await $fetch("/api/admin/tutorial/steps", {
				method: "POST",
				body: formData,
			})
		} else {
			await $fetch("/api/admin/tutorial/steps", {
				method: "PATCH",
				body: formData,
			})
		}
		emit("stepChanged", { stepID: props.stepID })
	} catch (error) {
		// idk for now
	}
}

const removeStep = async () => {
	try {
		if (props.isNewStep == false) {
			await $fetch("/api/admin/tutorial/steps", {
				method: "DELETE",
				body: {
					id: props.stepID,
				},
			})
		}

		emit("stepChanged", { stepID: props.stepID })
	} catch (error) {
		console.error("Failed to delete step:", error)
	}
}
</script>
