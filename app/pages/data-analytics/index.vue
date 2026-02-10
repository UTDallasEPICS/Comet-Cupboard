<template>
	<div class="p-4">
		<div class="flex flex-row gap-x-4">
			<DataAnalyticsNavigationList @update:navigate-data="(dataPage) => (navigateData = dataPage)" />
			<DataAnalyticsIncomingItemsChart v-if="navigateData === 'items-in'" title="Test" time-level="Week" />
		</div>
	</div>
</template>

<script lang="ts" setup>
const navigateData = ref<string>("items-in")
</script>
