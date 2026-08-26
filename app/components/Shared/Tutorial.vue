<template>
	<UModal
		v-model:open="open"
		:title="`${modalTitle} ${viewModel.isTutorialGroup ? 'Tutorials' : ''}`"
		@after:leave="resetTutorial"
		:ui="{
			body: 'overflow-x-hidden',
		}"
	>
		<slot />
		<template #body>
			<UContainer class="min-h-128 max-w-96 min-w-72">
				<Transition name="slide" mode="out-in">
					<section :key="viewModel.isTutorialGroup ? (selectedTutorialIndex ?? 'tutorial-list') : 'tutorial'">
						<div v-if="viewModel.isTutorialGroup && selectedTutorialIndex === null">
							<div v-if="tutorials.length !== 0" class="flex w-full flex-col gap-2">
								<SharedButtonActionButton
									v-for="(tutorial, index) in tutorials"
									:key="tutorial.tutorialID"
									action="neutral"
									:text="tutorial.tutorialName"
									leading-icon="i-lucide-book"
									trailing-icon="i-lucide-chevron-right"
									justify="between"
									variant="outline"
									size="xl"
									@click="selectTutorial(index)"
								/>
							</div>
							<div v-else>
								<SharedTextBaseSecondary>This tutorial group doesn't have any tutorials yet.</SharedTextBaseSecondary>
							</div>
						</div>
						<div v-else-if="activeTutorial">
							<SharedTextBase class="text-center">{{ activeTutorial.tutorialName }}</SharedTextBase>
							<div v-if="activeTutorial.tutorialSteps.length === 0" class="flex flex-col items-center justify-center gap-4 py-8 text-center">
								<SharedTextBaseSecondary>This tutorial doesn't have any steps yet.</SharedTextBaseSecondary>
								<SharedButtonActionButton
									action="positive"
									variant="solid"
									size="xl"
									class="mt-4"
									leading-icon="i-lucide-arrow-left"
									text="Back to tutorials"
									@click="backToTutorials"
								/>
							</div>
							<template v-else>
								<UCarousel
									v-slot="{ item: step }"
									:items="activeTutorial.tutorialSteps"
									arrows
									class="mt-4 flex w-full"
									@select="currentCarouselNumber = $event"
								>
									<img
										:src="`/api/public/image/${getTutorialStepImageUrl(step as unknown)}`"
										class="mx-auto aspect-auto w-full rounded-lg"
										loading="lazy"
									/>
								</UCarousel>
								<SharedTextBaseSecondary class="mt-2 text-center">{{ currentStep?.description }}</SharedTextBaseSecondary>
								<SharedTextBase class="mt-2 text-center"
									>{{ currentCarouselNumber + 1 }} / {{ activeTutorial.tutorialSteps.length }}</SharedTextBase
								>
								<div class="flex w-full flex-row items-center justify-center">
									<SharedButtonActionButton
										v-if="viewModel.isTutorialGroup && currentCarouselNumber === activeTutorial.tutorialSteps.length - 1"
										action="positive"
										variant="solid"
										size="xl"
										class="mt-4"
										leading-icon="i-lucide-arrow-left"
										text="Back to tutorials"
										@click="backToTutorials"
									/>
								</div>
							</template>
						</div>
					</section>
				</Transition>
			</UContainer>
		</template>
	</UModal>
</template>

<script setup lang="ts">
type TutorialStep = { tutorialStepID: string; imageUrl: string; description: string; stepOrdering: number }
type Tutorial = { tutorialID: string; tutorialName: string; tutorialSteps: TutorialStep[] }
type TutorialGroup = { tutorialGroupID: string; tutorialGroupName: string; tutorials: Tutorial[] }

const props = defineProps<{ tutorial: Tutorial | TutorialGroup }>()

const open = ref(false)
const currentCarouselNumber = ref(0)
const selectedTutorialIndex = ref<number | null>(null)
const viewModel = computed(() => {
	const tutorial = props.tutorial as Tutorial | TutorialGroup
	if ("tutorials" in tutorial) {
		return { isTutorialGroup: true, title: tutorial.tutorialGroupName, tutorials: tutorial.tutorials }
	}
	return { isTutorialGroup: false, title: tutorial.tutorialName, tutorials: [tutorial] }
})
const tutorials = computed(() => viewModel.value.tutorials)
const modalTitle = computed(() => viewModel.value.title)
const activeTutorial = computed(() => {
	if (viewModel.value.isTutorialGroup && selectedTutorialIndex.value === null) return null
	return tutorials.value[selectedTutorialIndex.value ?? 0]
})
const currentStep = computed(() => activeTutorial.value?.tutorialSteps[currentCarouselNumber.value] ?? null)
const getTutorialStepImageUrl = (step: unknown) => {
	return typeof step === "object" && step !== null && "imageUrl" in step && typeof step.imageUrl === "string" ? step.imageUrl : ""
}
const selectTutorial = (tutorialIndex: number) => {
	selectedTutorialIndex.value = tutorialIndex
	currentCarouselNumber.value = 0
}
const backToTutorials = () => {
	selectedTutorialIndex.value = null
	currentCarouselNumber.value = 0
}
const resetTutorial = () => {
	selectedTutorialIndex.value = null
	currentCarouselNumber.value = 0
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
	transition: all 0.25s ease;
}

.slide-enter-from {
	transform: translateX(100%);
	opacity: 0;
}

.slide-leave-to {
	transform: translateX(-100%);
	opacity: 0;
}
</style>
