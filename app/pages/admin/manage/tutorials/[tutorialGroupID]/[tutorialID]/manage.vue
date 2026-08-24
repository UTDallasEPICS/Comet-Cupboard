<template>
	<div>
		<NuxtLayout
			name="main"
			:title="`Manage ${tutorial?.tutorialName ?? 'Tutorial'} Steps`"
			:back-navigation="{ text: `Back to Tutorials`, to: `/admin/manage/tutorials` }"
		>
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto flex w-96 flex-col items-center gap-4">
					<UCarousel v-slot="{ item: step }" :items="tutorial?.tutorialSteps ?? []" arrows class="mt-4 flex w-full">
						<div>
							<UCard>
								<div class="mx-auto mb-2 flex justify-end">
									<UDropdownMenu :items="items(step.tutorialStepID)" :ui="{ content: 'align-end' }">
										<UButton :icon="icons['ellipsesActions']" color="neutral" variant="ghost" />
									</UDropdownMenu>
								</div>
								<img :src="`/api/public/image/${step.imageUrl}`" class="mx-auto aspect-auto h-152 rounded-lg" loading="lazy" />
								<SharedTextBase class="mt-3 text-center"> {{ step.description }}</SharedTextBase>
							</UCard>
						</div>
					</UCarousel>
					<UButton
						label="Create a new step"
						color="neutral"
						variant="outline"
						class="w-max"
						trailing-icon="i-lucide-plus"
						@click="navigateTo(`/admin/manage/tutorials/${tutorialGroupID}/${tutorialID}/edit`)"
					/>
				</div>
			</section>
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

const tutorial = computed(() => {
	const tutorialGroup = tutorialGroups.value?.find((group) => group.tutorialGroupID === tutorialGroupID)
	return tutorialGroup?.tutorials?.find((tutorial) => tutorial.tutorialID === tutorialID)
})

const currentCarouselNumber = ref(0)
const currentStep = computed(() => tutorial.value?.tutorialSteps[currentCarouselNumber.value])

const items = (stepID: string): DropdownMenuItem[][] => [
	[
		{
			label: "Edit Step",
			icon: "i-lucide-pencil",
			onSelect: () => navigateTo(`/admin/manage/tutorials/${tutorialGroupID}/${tutorialID}/edit`),
		},
	],
	[
		{
			label: "Delete Step",
			color: "error",
			icon: "i-lucide-trash",
			onSelect: () => deleteStep(stepID),
		},
	],
]

const deleteStep = async (stepID: string) => {
	try {
		await $fetch("/api/admin/tutorial/tutorial/step", {
			method: "DELETE",
			query: { tutorialStepID: stepID },
		})
		currentCarouselNumber.value = 0
		await refresh()
	} catch (err: any) {
		console.error("Failed to delete step:", err)
	}
}
</script>
