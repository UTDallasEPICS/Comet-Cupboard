<template>
	<div>
		<NuxtLayout name="main" :title="`Edit ${currentPage.name} Page`" :back-navigation="{ text: `Back to Tutorials`, to: `/admin/manage/tutorials` }">
			<USeparator class="my-4" />
			<div class="flex flex-col gap-4">
				<section>
					<div class="mx-auto w-96">
						<UCard>
							<UFormField
								id="pageName"
								name="pageName"
								label="Page Name"
								description="Page name must be at most 20 characters and only contain letters and spaces"
								required
							>
								<UInput v-model="state.name" placeholder="Enter new page name" />
							</UFormField>
							<div v-if="nameChanged" class="mt-4 flex justify-end gap-2">
								<UButton class="bg-gray-400" :icon="icons[`close`]" @click="cancelName" />
								<UButton class="bg-green-500" :icon="icons[`check`]" @click="confirmName" />
							</div>
						</UCard>
					</div>
				</section>

				<section>
					<div class="mx-auto flex w-96 flex-col gap-4">
						<UCard v-for="(step, index) in state.steps" :key="step.key">
							<div class="mb-4 flex items-center justify-between">
								<SharedTextBase class="font-semibold"> Step {{ index + 1 }} </SharedTextBase>
								<UButton v-if="state.steps.length > 1" icon="i-lucide-x" color="error" variant="ghost" size="sm" @click="removeStep(index)" />
							</div>
							<UFormField
								:id="`steps.${index}.image`"
								:name="`steps.${index}.image`"
								label="Step Image"
								class="mb-2"
								description="JPG or PNG. 2MB Max. Image must be 16:9 (for example 1200x675px)"
								required
							>
								<div class="flex flex-col">
									<div v-if="step.imageURL" class="relative overflow-hidden rounded-lg">
										<img :src="`/api/public/image/${step.imageURL}`" alt="Step Image" class="h-full w-full object-contain" loading="lazy" />
										<UButton
											:icon="icons[`close`]"
											color="error"
											variant="solid"
											class="absolute top-1 right-1"
											@click="removeImage(step)"
										/>
									</div>
									<UFileUpload v-else v-model="step.image" class="aspect-square w-full" label="Upload image" accept=".jpg,.jpeg,.png" />
								</div>
							</UFormField>
							<UFormField
								:id="`steps.${index}.description`"
								:name="`steps.${index}.description`"
								label="Step Description"
								description="Describe what the user should do in this step"
								required
							>
								<UTextarea v-model="step.description" placeholder="Enter step description" class="w-full" />
							</UFormField>

							<div v-if="stepChanged(step)" class="mt-4 flex justify-end gap-2">
								<UButton class="bg-gray-400" :icon="icons[`close`]" @click="cancelStep(index)" />
								<UButton class="bg-green-500" :icon="icons[`check`]" @click="confirmStep(index)" />
							</div>
						</UCard>

						<div class="flex justify-center">
							<UButton
								label="Add step"
								color="neutral"
								variant="outline"
								trailing-icon="i-lucide-plus"
								:disabled="!canAddStep"
								@click="addStep"
							/>
						</div>
					</div>
				</section>
			</div>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
import * as z from "zod"

definePageMeta({ layout: false })

const route = useRoute()
const tutorialID = route.params.tutorialID as string
const pageID = route.params.pageID as string

const originalName = ref("")
const originalSteps = ref<EditStep[]>([])

type EditStep = {
	key: number
	id?: string
	description: string
	image?: File
	imageURL?: string
	isNew?: boolean
}

const { data: groups } = await useFetch("/api/admin/tutorial/groups", {
	method: "GET",
})

const currentPage = computed(() => {
	const group = groups.value?.find((group) => group.id === tutorialID)
	return group?.pages?.find((page) => page.id === pageID)
})

const stepSchema = imageSchema.extend({
	description: z.string().min(1, "Description is required"),
	image: z.any().optional(),
})

const formSchema = z.object({
	name: z
		.string()
		.min(1, "Item name is required")
		.max(20, "Item name must be at most 20 characters")
		.regex(/^[A-Za-z ]+$/, "Item name must only contain letters and spaces"),
	steps: z.array(stepSchema).min(1, "At least one step is required"),
})

let keyCounter = 0

const makeEmptyStep = (): EditStep => ({
	key: keyCounter++,
	description: "",
	image: undefined,
	imageURL: undefined,
	isNew: true,
})

const makeExistingStep = (step: { id: string; imageURL: string; description: string }): EditStep => ({
	key: keyCounter++,
	id: step.id,
	description: step.description,
	imageURL: step.imageURL,
	image: undefined,
	isNew: false,
})

const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	name: currentPage.value?.name ?? "",
	steps: currentPage.value?.steps.map(makeExistingStep) ?? [],
}))

const initializeOriginalState = () => {
	if (!currentPage.value) return

	originalName.value = currentPage.value.name

	originalSteps.value = currentPage.value.steps.map((step) => ({
		key: keyCounter++,
		id: step.id,
		description: step.description,
		imageURL: step.imageURL,
		image: undefined,
	}))
}

initializeOriginalState()

const nameChanged = computed(() => {
	return state.value.name !== originalName.value
})

const confirmName = async () => {
	try {
		await $fetch("/api/admin/tutorial/pages", {
			method: "PUT",
			body: {
				id: pageID,
				name: state.value.name,
			},
		})

		originalName.value = state.value.name
	} catch (error) {
		console.error(error)
	}
}

const canAddStep = computed(() => {
	const lastStep = state.value.steps.at(-1)

	return !lastStep || !lastStep.isNew
})

const cancelName = () => {
	state.value.name = originalName.value
}

const addStep = () => {
	state.value.steps.push(makeEmptyStep())
}

const removeStep = async (index: number) => {
	const step = state.value.steps[index]

	if (step.isNew) {
		state.value.steps?.splice(index, 1)
		return
	}

	try {
		await $fetch("/api/admin/tutorial/steps", {
			method: "DELETE",
			body: {
				id: step.id,
			},
		})

		state.value.steps?.splice(index, 1)

		originalSteps.value = originalSteps.value.filter((originalStep) => originalStep.id !== step.id)
	} catch (error) {
		console.error("Failed to delete step:", error)
	}
}

const stepChanged = (step: EditStep, index: number) => {
	if (step.isNew) {
		return true
	}

	const original = originalSteps.value.find((originalStep) => originalStep.id === step.id)

	if (!original) {
		return true
	}

	return step.description !== original.description || step.image !== undefined || step.imageURL !== original.imageURL
}

const cancelStep = (index: number) => {
	const step = state.value.steps[index]

	if (step.isNew) {
		state.value.steps.splice(index, 1)
		return
	}

	const original = originalSteps.value.find((originalStep) => originalStep.id === step.id)

	if (!original) return

	state.value.steps[index] = {
		...original,
		key: step.key,
		image: undefined,
	}
}

const removeImage = (step: EditStep) => {
	step.imageURL = undefined
	step.image = undefined
}

const confirmStep = async (index: number) => {
	const step = state.value.steps[index]

	if (step.isNew) {
		await createStep(step)
		return
	}

	await updateStep(step)
}

const createStep = async (step: EditStep) => {
	const formData = new FormData()

	formData.append("pageID", pageID)
	formData.append("description", step.description)

	if (step.image) {
		formData.append("image", step.image)
	}

	const createdStep = await $fetch("/api/admin/tutorial/steps", {
		method: "POST",
		body: formData,
	})

	const savedStep: EditStep = {
		key: step.key,
		id: createdStep.id,
		description: createdStep.description,
		imageURL: createdStep.imageURL,
		image: undefined,
		isNew: false,
	}

	const index = state.value.steps.findIndex((currentStep) => currentStep.key === step.key)

	if (index !== -1) {
		state.value.steps[index] = savedStep
	}

	originalSteps.value.push({
		...savedStep,
	})
}

const updateStep = async (step: EditStep) => {
	const original = originalSteps.value.find((originalStep) => originalStep.id === step.id)

	const formData = new FormData()

	formData.append("id", step.id!)
	formData.append("description", step.description)

	const imageRemoved = !step.imageURL && !step.image && !!original?.imageURL

	formData.append("removeImage", String(!!imageRemoved))

	if (step.image) {
		formData.append("image", step.image)
	}

	const updatedStep = await $fetch("/api/admin/tutorial/steps", {
		method: "PATCH",
		body: formData,
	})

	const index = state.value.steps.findIndex((currentStep) => currentStep.key === step.key)

	if (index !== -1) {
		const savedStep: EditStep = {
			key: step.key,
			id: updatedStep.id,
			description: updatedStep.description,
			imageURL: updatedStep.imageURL,
			image: undefined,
			isNew: false,
		}

		state.value.steps[index] = savedStep

		const originalIndex = originalSteps.value.findIndex((originalStep) => originalStep.id === step.id)

		if (originalIndex !== -1) {
			originalSteps.value[originalIndex] = {
				...savedStep,
			}
		}
	}
}
</script>
