<template>
	<div class="grid gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 sm:grid-cols-2 xl:grid-cols-4">
		<div v-for="metric in metrics" :key="metric.label" class="bg-white p-4">
			<div class="flex items-start justify-between gap-3">
				<div>
					<SharedTextBase class="text-xs font-medium tracking-wide text-gray-500 uppercase">{{ metric.label }}</SharedTextBase>
					<SharedTextBase class="mt-2 text-2xl font-semibold text-gray-900">{{ metric.value }}</SharedTextBase>
				</div>
				<div class="rounded-full bg-orange-50 p-2 text-utd-orange"><UIcon :name="metric.icon" class="size-5" /></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{ metrics: Array<{ label: string; value: number | string; icon: string }> }>()
</script>