<template>
	<UCard class="min-w-72 border-[#e4701e]">
		<template #header>
			<div class="flex justify-center text-2xl font-bold">
				{{ title }}
			</div>
		</template>
		<div v-for="item in items" :key="item.label" class="flex justify-between mb-4">
			<span>{{ item.label }}</span>
			<span>{{ item.value }}</span>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps<{
	title: string
	items: {
		label: string
		value: number | string
	}[]
}>()

console.log(props.items)
</script>
