<template>
	<UContainer class="py-4 sm:py-8">
		<header class="mb-4">
			<div class="flex flex-row items-center">
				<SharedButtonNavigateBack v-if="backNavigation" :text="backNavigation.text" :to="backNavigation.to" />
			</div>
			<SharedTextPageTitle>{{ props.title }}</SharedTextPageTitle>
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
}>()
</script>
