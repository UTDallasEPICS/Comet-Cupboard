<template>
	<div class="mx-20">
		<div class="flex flex-col items-center">
			<div class="h-10 flex items-center text-black justify-center text-l font-bold">
				{{ title }}
			</div>

			<div class="flex text-5xl font-bold text-black justify-center">
				<span>{{ value }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
	title: string
	value: number | string
}>()
</script>
