<template>
	<UAlert :icon="icons['warning']" color="warning" variant="solid" class="text-black">
		<template #title>
			<ul class="ml-4 list-disc">
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
