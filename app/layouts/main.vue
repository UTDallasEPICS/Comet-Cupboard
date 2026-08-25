<template>
	<UContainer class="py-4 sm:py-8">
		<header class="mb-4">
			<div class="flex flex-row items-center">
				<SharedButtonActionButton
					action="navigate-back"
					button-variant="ghost"
					v-if="backNavigation"
					:text="backNavigation.text"
					:to="backNavigation.to"
				/>
			</div>
			<div class="flex flex-row flex-nowrap items-center gap-2">
				<SharedTextPageTitle>{{ props.title }}</SharedTextPageTitle>
				<SharedTutorial v-if="props.tutorialData" :tutorial="props.tutorialData">
					<SharedButtonActionButton color="neutral" variant="ghost" icon="i-lucide-info" />
				</SharedTutorial>
			</div>
		</header>

		<slot />
	</UContainer>
</template>

<script setup lang="ts">
const props = defineProps<{
	title: string
	backNavigation?: {
		text: string
		to: string
	}
	tutorialData?: {
		tutorialGroupID: string
		tutorialGroupName: string
		tutorials: {
			tutorialID: string
			tutorialName: string
			tutorialSteps: {
				tutorialStepID: string
				imageUrl: string
				description: string
				stepOrdering: number
			}[]
		}[]
	}
}>()
</script>
