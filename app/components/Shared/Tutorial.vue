<template>
	<UModal v-model:open="open" :title="tutorial.title" @after:leave="resetTutorial">
		<slot />
		<!-- <UButton :icon="icons['information']" color="neutral" variant="ghost" /> -->

		<template #body>
			<UContainer class="min-h-128 max-w-96 min-w-72">
				<Transition name="slide" mode="out-in">
					<section :key="current">
						<!-- Home -->
						<div v-if="current === 'home'">
							<div class="flex flex-col gap-2">
								<UButton
									v-for="(page, index) in tutorial.tutorialPages"
									:key="index"
									color="primary"
									variant="outline"
									size="xl"
									@click="push(index)"
								>
									<template #default>
										<div class="flex w-full items-center justify-between">
											<SharedTextBase class="text-left">
												{{ page.title }}
											</SharedTextBase>

											<UIcon :name="icons['tutorial_right']" class="size-6" />
										</div>
									</template>
								</UButton>
							</div>
						</div>

						<!-- Tutorial Page -->
						<div v-else-if="activePage">
							<SharedTextBase class="text-center">
								{{ activePage.title }}
							</SharedTextBase>

							<div v-if="activePage.content.length === 0" class="flex flex-col items-center justify-center gap-4 py-8 text-center">
								<SharedTextBaseSecondary> This tutorial doesn't have any steps yet. </SharedTextBaseSecondary>

								<UButton
									v-if="props.editPageUrl"
									color="neutral"
									variant="outline"
									:leading-icon="icons['add']"
									@click="navigateTo(props.editPageUrl)"
								>
									Add steps to tutorial
								</UButton>
							</div>

							<template v-else>
								<UCarousel
									v-slot="{ item: step }"
									:items="activePage.content"
									arrows
									class="mt-4 flex w-full"
									@select="currentCarouselNumber = $event"
								>
									<img :src="`/api/public/image/${step.imageURL}`" class="mx-auto aspect-auto h-152 rounded-lg" loading="lazy" />
								</UCarousel>

								<SharedTextBaseSecondary class="mt-2 text-center">
									{{ currentStep?.description }}
								</SharedTextBaseSecondary>

								<SharedTextBase class="mt-2 text-center">
									{{ currentCarouselNumber + 1 }} /
									{{ activePage.content.length }}
								</SharedTextBase>

								<div
									v-if="props.initialPage === undefined && currentCarouselNumber === activePage.content.length - 1"
									class="flex justify-center"
								>
									<UButton color="secondary" variant="solid" size="xl" class="mt-4" @click="pop"> Back to Tutorial Pages </UButton>
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
const props = defineProps<{
	tutorial: {
		title: string
		tutorialPages: {
			title: string
			content: {
				imageURL: string
				description: string
			}[]
		}[]
	}
	initialPage?: number
	editPageUrl?: string
}>()

const open = ref(false)

const stack = ref<(number | "home")[]>([props.initialPage ?? "home"])

const currentCarouselNumber = ref(0)

const current = computed(() => stack.value[stack.value.length - 1])

const activePage = computed(() => {
	if (current.value === "home") return null

	return props.tutorial.tutorialPages[current.value]
})

const currentStep = computed(() => {
	if (!activePage.value) return null

	return activePage.value.content[currentCarouselNumber.value]
})

const push = (pageIndex: number) => {
	stack.value.push(pageIndex)
	currentCarouselNumber.value = 0
}

const pop = () => {
	if (stack.value.length > 1) {
		stack.value.pop()
		currentCarouselNumber.value = 0
	}
}

const resetTutorial = () => {
	stack.value = [props.initialPage ?? "home"]
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
