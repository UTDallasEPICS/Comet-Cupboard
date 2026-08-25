<template>
	<SharedButtonActionButton left-align :to="to" class="border-border-soft w-full border bg-white p-4 shadow-md">
		<div class="flex items-center gap-4">
			<SharedIcon :name="icon" class="text-text-soft h-8 w-8" />
			<div class="flex flex-col text-left">
				<SharedTextCardTitle>{{ label }}</SharedTextCardTitle>
				<SharedTextBase class="text-nowrap">{{ description }}</SharedTextBase>
			</div>
		</div>
	</SharedButtonActionButton>
</template>

<script setup lang="ts">
import type { PropType } from "vue"

const props = defineProps({
	to: { type: String, required: true },
	label: { type: String, required: true },
	description: { type: String, required: true },
	icon: { type: String as PropType<Icon>, required: true },
})
</script>
