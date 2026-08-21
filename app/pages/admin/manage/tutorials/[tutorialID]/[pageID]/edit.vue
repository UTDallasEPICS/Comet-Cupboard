<template>
	<div>
		<NuxtLayout name="main" :title="`Edit ${currentPage.name} Page`" :back-navigation="{ text: `Back to Tutorials`, to: `/admin/manage/tutorials` }">
			<USeparator class="my-4" />
			<div class="flex flex-col items-center justify-center gap-4">
				<UButton label="Delete Page" color="error" variant="outline" :icon="icons['delete']" @click="isDeleteModalOpen = true" />
				<section>
					<ManageTutorialNameEditor :original-name="originalName" :pageID="pageID" @name-changed="refresh" />
				</section>

				<section>
					<div class="mx-auto flex w-96 flex-col gap-4">
						<ManageTutorialStepEditor
							v-for="step in stepsWithTemporaryStep"
							:key="`${step.id}-${stepRefreshKeys[step.id] ?? 0}`"
							:stepID="step.id"
							:pageID="step.pageID"
							:originalDescription="step.description"
							:originalImageURL="step.imageURL"
							:stepIndex="step.stepIndex"
							:isNewStep="step.isNewStep"
							@step-changed="handleStepChanged"
						/>

						<div class="flex justify-center">
							<UButton v-if="canAddStep" label="Add step" color="neutral" variant="outline" trailing-icon="i-lucide-plus" @click="addStep" />
							<UAlert
								v-else
								title="You must save the current step before adding a new one"
								:icon="icons['information']"
								color="warning"
								variant="solid"
								class="text-black"
							/>
						</div>
						<UModal v-model:open="isDeleteModalOpen" title="Delete page?">
							<template #body>
								<p>Are you sure you want to delete the {{ currentPage.name }} page?</p>
							</template>
							<template #footer>
								<div class="flex w-full justify-between">
									<SharedButtonCancel text="Cancel" @click="isDeleteModalOpen = false" />
									<UButton label="Delete Page" color="error" variant="solid" @click="deletePage" />
								</div>
							</template>
						</UModal>
					</div>
				</section>
			</div>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })

const route = useRoute()
const tutorialID = route.params.tutorialID as string
const pageID = route.params.pageID as string

const { data: groups, refresh } = await useFetch("/api/admin/tutorial/groups", {
	method: "GET",
})

const currentPage = computed(() => {
	const group = groups.value?.find((group) => group.id === tutorialID)
	return group?.pages?.find((page) => page.id === pageID)
})

const originalName = computed(() => currentPage.value?.name ?? "")

const steps = computed(() => currentPage.value?.steps ?? [])

const temporaryStepToCreate = ref(null)

const stepsWithTemporaryStep = computed(() => {
	const stepsWithStepIndex = steps.value.map((step, index) => ({ ...step, stepIndex: index + 1, isNewStep: false }))
	if (temporaryStepToCreate.value) {
		return [...stepsWithStepIndex, temporaryStepToCreate.value]
	}
	return stepsWithStepIndex
})

console.log(stepsWithTemporaryStep.value)

const canAddStep = computed(() => {
	return temporaryStepToCreate.value === null
})

const addStep = () => {
	temporaryStepToCreate.value = {
		id: "",
		imageURL: "",
		description: "",
		stepIndex: steps.value.length + 1,
		pageID: pageID,
		isNewStep: true,
	}
}

const stepRefreshKeys = ref<Record<string, number>>({})

const handleStepChanged = async (changeInformation) => {
	const stepID = changeInformation.stepID

	// New step
	if (stepID === "") {
		temporaryStepToCreate.value = null
		await refresh()
		return
	}

	// Refresh the data
	await refresh()

	// Increment only this step's key
	stepRefreshKeys.value[stepID] = (stepRefreshKeys.value[stepID] ?? 0) + 1
}

const isDeleteModalOpen = ref(false)

const deletePage = async () => {
	try {
		await $fetch("/api/admin/tutorial/pages", {
			method: "DELETE",
			body: { pageID: pageID },
		})
		isDeleteModalOpen.value = false
		await navigateTo("/admin/manage/tutorials")
	} catch (error) {
		console.error(error)
	}
}
</script>
