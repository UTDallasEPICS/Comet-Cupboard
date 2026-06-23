<template>
	<UCard class="mx-4 w-60 border-[#e4701e]">
		<div class="flex flex-col items-center">
			<div class="h-10 flex items-center justify-center text-sm font-bold">
				{{ title }}
			</div>

			<div class="flex justify-center">
				<span>{{ value }}</span>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps<{
	title: string
	value: number | string
}>()
</script>
