<template>
	<div>
		<NuxtLayout name="main" :title="`Manage ${page.name} Steps`" :back-navigation="{ text: `Back to Tutorials`, to: `/admin/manage/tutorials` }">
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto flex w-96 flex-col items-center gap-4">
					<UCarousel v-slot="{ item: step }" :items="page.steps" arrows class="mt-4 flex w-full">
						<div>
							<UCard>
								<div class="mx-auto mb-2 flex justify-end">
									<UDropdownMenu :items="items(step.id)" :ui="{ content: 'align-end' }">
										<UButton :icon="icons['ellipsesActions']" color="neutral" variant="ghost" />
									</UDropdownMenu>
								</div>
								<img :src="`/api/public/image/${step.imageURL}`" class="mx-auto aspect-auto h-152 rounded-lg" loading="lazy" />
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
						@click="navigateTo(`/admin/manage/tutorials/${tutorialID}/${pageID}/add`)"
					/>
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })

const route = useRoute()
const tutorialID = route.params.tutorialID as string
const pageID = route.params.pageID as string

const { data: page, refresh } = await useFetch(`/api/admin/tutorial/tutorialPages/${pageID}`)

console.log(page.value)

const currentCarouselNumber = ref(0)
const currentStep = computed(() => page.value?.steps[currentCarouselNumber.value])

const items = (stepID: string): DropdownMenuItem[][] => [
	[
		{
			label: "Edit Step",
			icon: "i-lucide-pencil",
			onSelect: () => navigateTo(`/admin/manage/tutorials/${tutorialID}/${pageID}/${stepID}/edit`),
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
		await $fetch(`/api/admin/tutorial/steps`, {
			method: "DELETE",
			body: {
				stepID,
			},
		})
		currentCarouselNumber.value = 0
		await refresh()
	} catch (err: any) {
		console.error("Failed to delete step:", err)
	}
}
</script>
