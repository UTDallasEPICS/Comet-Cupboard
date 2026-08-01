<template>
	<UContainer class="py-4 sm:py-8">
		<header class="mb-4">
			<div class="flex flex-row items-center">
				<SharedButtonNavigateBack v-if="backNavigation" :text="backNavigation.text" :to="backNavigation.to" />
			</div>
			<div class="flex flex-row flex-nowrap items-center gap-2">
				<SharedTextPageTitle>{{ props.title }}</SharedTextPageTitle>
				<SharedTutorial v-if="props.tutorialData" :tutorial="props.tutorialData" />
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
		title: string
		tutorialPages: {
			title: string
			content: {
				imageURL: string
				description: string
			}[]
		}[]
	}
}>()
</script>
