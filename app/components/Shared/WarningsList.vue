<template>
	<UAlert icon="i-lucide-triangle-alert" color="warning" variant="solid" class="text-black">
		<template #title>
			<ul class="ml-4 list-disc">
				<li v-for="(warning, index) in props.warnings" :key="index">
					{{ warning.message }}
					<template v-for="(link, linkIndex) in warning.links" :key="linkIndex">
						<button type="button" class="cursor-pointer underline underline-offset-2" @click="emit('navigate', link)">{{ link.label }}</button
						><span v-if="linkIndex < warning.links.length - 1">, </span>
					</template>
				</li>
			</ul>
		</template>
	</UAlert>
</template>

<script lang="ts" setup>
type WarningLink = { label: string; categoryName: string; itemID?: string }
type Warning = { message: string; links: WarningLink[] }

const props = defineProps({
	warnings: {
		type: Array as () => Warning[],
		default: () => [],
	},
})

const emit = defineEmits<{ navigate: [link: WarningLink] }>()
</script>
