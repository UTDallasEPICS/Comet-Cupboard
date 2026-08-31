<template>
	<UCard :ui="{ body: 'p-3 sm:p-5' }">
		<template #header>
			<div>
				<SharedTextBase class="text-xs font-medium tracking-wide text-gray-500 uppercase">{{ eyebrow }}</SharedTextBase>
				<SharedTextSectionTitle class="mt-1">{{ title }}</SharedTextSectionTitle>
			</div>
		</template>
		<div class="h-80"><canvas ref="canvas" /></div>
	</UCard>
</template>

<script setup lang="ts">
import { Chart } from "chart.js/auto"

const props = withDefaults(defineProps<{ title: string; eyebrow: string; labels: string[]; datasets: any[]; type?: "bar" | "line"; clickable?: boolean }>(), {
	type: "bar",
	clickable: false,
})
const emit = defineEmits<{ "label-click": [label: string] }>()
const canvas = useTemplateRef<HTMLCanvasElement>("canvas")
const chart = shallowRef<Chart | null>(null)

const updateChart = () => {
	if (!chart.value) return
	chart.value.data.labels = props.labels
	chart.value.data.datasets = props.datasets
	chart.value.update()
}

onMounted(() => {
	chart.value = new Chart(canvas.value!, {
		type: props.type,
		data: { labels: props.labels, datasets: props.datasets },
		options: {
			responsive: true,
			maintainAspectRatio: false,
			interaction: { mode: "index", intersect: false },
			plugins: { legend: { position: "bottom" } },
			scales: { x: { grid: { display: false } }, y: { beginAtZero: true, border: { display: false }, ticks: { precision: 0 } } },
			onHover: (nativeEvent, elements) => {
				const target = nativeEvent.native?.target as HTMLElement | undefined
				if (target) target.style.cursor = props.clickable && elements.length ? "pointer" : "default"
			},
			onClick: (_nativeEvent, elements) => {
				if (!props.clickable || !elements.length) return
				const label = props.labels[elements[0]!.index]
				if (label) emit("label-click", label)
			},
		},
	})
})
watch(() => [props.labels, props.datasets], updateChart, { deep: true })
onBeforeUnmount(() => chart.value?.destroy())
</script>
