<template>
	<div>
		<NuxtLayout
			name="main"
			:title="`Edit ${currentTutorial?.tutorialName ?? 'Tutorial'}`"
			:back-navigation="{ text: `Back to Tutorials`, to: `/admin/manage/tutorials` }"
		>
			<USeparator class="my-4" />
			<div class="flex flex-col items-center justify-center gap-4">
				<UModal v-model:open="isDeleteModalOpen">
					<SharedButtonActionButton label="Delete Tutorial" color="error" variant="outline" icon="i-lucide-trash-2" />
					<template #content>
						<UCard>
							<SharedTextCardTitle>Confirm Deletion?</SharedTextCardTitle>
							<USeparator class="my-2" />
							<div class="mt-4 flex flex-row items-center justify-center gap-2">
								<SharedButtonActionButton action="cancel" text="Cancel" @click="isDeleteModalOpen = false" />
								<SharedButtonActionButton action="negative" text="Confirm Deletion" @click="deleteTutorial" />
							</div>
						</UCard>
					</template>
				</UModal>

				<section class="w-full max-w-xl">
					<ManageTutorialNameEditor
						:original-name="originalName"
						:tutorialID="tutorialID"
						:tutorialGroupID="tutorialGroupID"
						@name-changed="refresh"
					/>
				</section>

				<section class="w-full max-w-xl">
					<div class="mx-auto flex w-full flex-col gap-4">
						<ManageTutorialStepEditor
							v-for="step in stepsWithTemporaryStep"
							:key="`${step.tutorialStepID}-${stepRefreshKeys[step.tutorialStepID] ?? 0}`"
							:tutorialStepID="step.tutorialStepID"
							:tutorialID="step.tutorialID"
							:originalDescription="step.description"
							:originalImageURL="step.imageUrl"
							:stepIndex="step.stepIndex"
							:isNewStep="step.isNewStep"
							@step-changed="handleStepChanged"
						/>

						<div class="flex justify-center">
							<SharedButtonActionButton v-if="canAddStep" label="Add step" color="neutral" variant="outline" trailing-icon="i-lucide-plus" @click="addStep" />
							<UAlert
								v-else
								title="You must save the current step before adding a new one"
								icon="i-lucide-info"
								color="warning"
								variant="solid"
								class="text-black"
							/>
						</div>
					</div>
				</section>
			</div>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })

const route = useRoute()
const tutorialGroupID = route.params.tutorialGroupID as string
const tutorialID = route.params.tutorialID as string

const { data: tutorialGroups, refresh } = await useFetch("/api/admin/tutorial/tutorial/all-tutorials", {
	method: "GET",
})

const currentTutorialGroup = computed(() => {
	return tutorialGroups.value?.find((group) => group.tutorialGroupID === tutorialGroupID)
})

const currentTutorial = computed(() => {
	return currentTutorialGroup.value?.tutorials?.find((tutorial) => tutorial.tutorialID === tutorialID)
})

const originalName = computed(() => currentTutorial.value?.tutorialName ?? "")

const tutorialSteps = computed(() => currentTutorial.value?.tutorialSteps ?? [])

const temporaryStepToCreate = ref(null)

const stepsWithTemporaryStep = computed(() => {
	const stepsWithStepIndex = tutorialSteps.value.map((step, index) => ({ ...step, stepIndex: index + 1, isNewStep: false }))
	if (temporaryStepToCreate.value) {
		return [...stepsWithStepIndex, temporaryStepToCreate.value]
	}
	return stepsWithStepIndex
})

const canAddStep = computed(() => {
	return temporaryStepToCreate.value === null
})

const addStep = () => {
	temporaryStepToCreate.value = {
		tutorialStepID: "",
		imageUrl: "",
		description: "",
		stepIndex: tutorialSteps.value.length + 1,
		tutorialID: tutorialID,
		isNewStep: true,
	}
}

const stepRefreshKeys = ref<Record<string, number>>({})

const handleStepChanged = async (changeInformation) => {
	const tutorialStepID = changeInformation.tutorialStepID

	// New step
	if (tutorialStepID === "") {
		temporaryStepToCreate.value = null
		await refresh()
		return
	}

	// Refresh the data
	await refresh()

	// Increment only this step's key
	stepRefreshKeys.value[tutorialStepID] = (stepRefreshKeys.value[tutorialStepID] ?? 0) + 1
}

const isDeleteModalOpen = ref(false)

const deleteTutorial = async () => {
	try {
		await $fetch("/api/admin/tutorial/tutorial", {
			method: "DELETE",
			query: { tutorialID: tutorialID },
		})
		isDeleteModalOpen.value = false
		await navigateTo("/admin/manage/tutorials")
	} catch (error) {
		console.error(error)
	}
}
</script>
