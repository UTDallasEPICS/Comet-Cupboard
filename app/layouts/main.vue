<template>
	<UContainer class="py-4">
		<header class="mb-4">
			<div class="flex flex-row items-center">
				<SharedButtonNavigateBack v-if="backNavigation" :text="backNavigation.text" :to="backNavigation.to" />
				<SharedRefreshPageTimer v-if="refreshPageTimer !== undefined" :seconds="refreshPageTimer" class="ml-auto" />
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
	refreshPageTimer?: number
}>()
</script>
