<template>
	<SharedButtonActionButton justify="start" :to="to" class="border-border-soft w-full border bg-white p-4 shadow-md">
		<div class="flex w-full items-center gap-4">
			<SharedIcon :name="icon" class="text-text-soft h-8 w-8 shrink-0" />

			<div class="flex min-w-0 flex-col text-left">
				<SharedTextCardTitle class="wrap-break-word whitespace-normal">
					{{ label }}
				</SharedTextCardTitle>

				<SharedTextBase class="wrap-break-word whitespace-normal">
					{{ description }}
				</SharedTextBase>
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
