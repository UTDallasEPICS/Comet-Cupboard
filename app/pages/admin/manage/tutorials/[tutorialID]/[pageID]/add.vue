<template>
	<div>
		<NuxtLayout name="main" title="Add Tutorial Step" :back-navigation="{ text: `Back to Tutorials`, to: `/admin/manage/tutorials` }">
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto w-min">
					<UForm :validate="validate" :state="state" class="w-96 space-y-4" @submit="onSubmit" @error="onError">
						<UCard v-for="(step, index) in state.steps" :key="step.key">
							<div class="mb-4 flex items-center justify-between">
								<SharedTextBase class="font-semibold">Step {{ index + 1 }}</SharedTextBase>
								<UButton
									v-if="state.steps.length > 1"
									icon="i-lucide-x"
									color="error"
									variant="ghost"
									size="sm"
									@click="removeStep(index)"
								/>
							</div>
							<UFormField
								:id="`steps.${index}.image`"
								:name="`steps.${index}.image`"
								label="Step Image"
								class="mb-2"
								description="JPG or PNG. 2MB Max. Dimensions between 200x200 and 4096x4096 pixels"
								required
							>
								<div class="flex flex-col">
									<UFileUpload v-model="step.image" class="aspect-square w-full" label="Upload image" accept=".jpg,.jpeg,.png" />
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
						</UCard>

						<div class="flex justify-center">
							<UButton label="Add step" color="neutral" variant="outline" trailing-icon="i-lucide-plus" @click="addStep" />
						</div>

						<footer class="sticky right-4 bottom-8 mt-4 flex justify-end space-x-2 sm:ml-auto">
							<SharedButtonPositiveAction type="submit" text="Submit" />
						</footer>
					</UForm>
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
import * as z from "zod"

definePageMeta({ layout: false })

const route = useRoute()
const tutorialID = route.params.tutorialID as string
const pageID = route.params.pageID as string

const stepSchema = imageSchema.extend({
	description: z.string().min(1, "Description is required"),
})

const formSchema = z.object({
	steps: z.array(stepSchema).min(1, "At least one step is required"),
})

let keyCounter = 0
const makeEmptyStep = () => ({
	key: keyCounter++,
	description: undefined,
	image: undefined,
})

const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	steps: [makeEmptyStep()],
}))

const addStep = () => {
	state.value.steps.push(makeEmptyStep())
}

const removeStep = (index: number) => {
	state.value.steps.splice(index, 1)
}

const onSubmit = async (event) => {
	try {
		const formData = new FormData()
		formData.append("pageID", pageID)

		event.data.steps.forEach((step, index) => {
			formData.append(`steps[${index}][description]`, step.description)
			formData.append(`steps[${index}][image]`, step.image)
		})

		await $fetch("/api/admin/tutorial/steps", {
			method: "POST",
			body: {
				formData,
			},
		})

		navigateTo(`/admin/manage/tutorials`)
	} catch (error) {
		console.log(error)
	}
}
</script>
