<template>
	<div class="mx-20">
		<div class="flex flex-col items-center">
			<div class="text-l flex h-10 items-center justify-center font-bold text-black">
				{{ title }}
			</div>

			<div class="flex justify-center text-5xl font-bold text-black">
				<SharedTextBase class="text-5xl font-bold text-black">{{ value }}</SharedTextBase>
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
