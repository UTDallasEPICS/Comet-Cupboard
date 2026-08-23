<template>
	<UCard class="border-utd-orange min-w-72">
		<template #header>
			<div class="flex items-center justify-between">
				<header class="text-l flex font-bold">
					{{ title }}
				</header>
				<USwitch
					v-if="countToggle"
					v-model="showCount"
					unchecked-icon="i-lucide-percent"
					checked-icon="i-lucide-hash"
					class="flex justify-end"
					default-value
				/>
			</div>
		</template>
		<div v-for="item in items" :key="item.label" class="mb-4 flex justify-between">
			<SharedTextBase>{{ item.label }}</SharedTextBase>
			<SharedTextBase>{{ showCount ? item.count : `${item.percentage}%` }}</SharedTextBase>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const showCount = ref(false)

const props = defineProps<{
	title: string
	items: {
		label: string
		count: number
		percentage: string
	}[]
	countToggle: Boolean
}>()
</script>
