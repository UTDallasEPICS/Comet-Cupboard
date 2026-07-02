<template>
	<UCard class="min-w-72 border-[#e4701e]">
		<template #header>
			<div class="flex justify-between items-center">
				<h2 class="flex text-l font-bold">
					{{ title }}
				</h2>
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
		<div v-for="item in items" :key="item.label" class="flex justify-between mb-4">
			<span>{{ item.label }}</span>
			<span>{{ showCount ? item.count : `${item.percentage}%` }}</span>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const showCount=ref(false)

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