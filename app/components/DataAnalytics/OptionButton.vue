<template>
	<div class="flex items-center gap-4">
		<div v-if="showTimeLevel" class="flex shadow-l h-20 w-100 flex-col items-center rounded-2xl border-2 border-gray-200 bg-white p-2">
			<p class="place-self-start text-xl font-bold">Time Level</p>
			<div class="mt-2 w-full rounded-lg border">
				<span class="px-2">{{ grouping }}</span>
			</div>
		</div>

		<div v-if="showDateRange" class="flex shadow-l h-20 w-100 flex-col items-center rounded-2xl border-2 border-gray-200 bg-white p-2">
			<p class="place-self-start text-xl font-bold">Time Range</p>
			<div class="mt-2 w-full rounded-lg border">
				<span class="px-2">{{ dateRange }}</span>
			</div>
		</div>

		<UPopover>
			<UButton icon="i-lucide-sliders-horizontal" />

			<template #content>
				<slot></slot>
			</template>
		</UPopover>
	</div>
</template>

<script lang="ts" setup>
defineProps({
	grouping: String,
	dateRange: String,
	showTimeLevel: Boolean,
	showDateRange: Boolean,
})
</script>
