<script>
const { data: sources} = await useFetch('/api/head-admin/data/source')

const chartContainer = useTemplateRef("barContainer")

const sourceNames = computed(() => {
	if (sources.value){
		return sources.value.map(s => s.name)
	} else {
		return []
	}
})

onMounted(() => {
	chart.value = new Chart(chartContainer.value!, {
		type: 'bar',
		data: {
			labels: sourceNames.value,
			datasets: {
				data: [12, 9, 3, 5, 4]
			}
		}
	})
})
</script>