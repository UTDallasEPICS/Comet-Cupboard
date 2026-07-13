<template>
	<UAlert :icon="icons['warning']" color="warning" variant="solid" class="text-black">
		<template #title>
			<ul class="list-disc ml-4">
				<li v-for="warning in props.warnings" :key="warning">
					{{ warning }}
				</li>
			</ul>
		</template>
	</UAlert>
</template>

<script lang="ts" setup>
const props = defineProps({
	warnings: {
		type: Array as () => string[],
		default: () => [],
	},
})
</script>
