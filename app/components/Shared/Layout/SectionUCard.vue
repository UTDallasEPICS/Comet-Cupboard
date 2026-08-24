<template>
	<UCard>
		<div class="flex items-center justify-between">
			<div class="flex min-w-0 items-center gap-2">
				<div v-if="$slots.icon" class="flex size-5 shrink-0 items-center justify-center">
					<slot name="icon" />
				</div>
				<SharedTextCardTitle class="min-w-0">{{ title }}</SharedTextCardTitle>
			</div>
			<div v-if="$slots.header" class="shrink-0">
				<slot name="header" />
			</div>
		</div>
		<div v-if="$slots.headerContent" class="mt-4">
			<slot name="headerContent" />
		</div>
		<USeparator class="my-4" />
		<slot v-if="hasContent" />
		<SharedTextBase v-else-if="emptyText" class="text-muted">{{ emptyText }}</SharedTextBase>
	</UCard>
</template>

<script setup lang="ts">
import { computed, useSlots, Comment } from "vue"

const props = withDefaults(
	defineProps<{
		title: string
		emptyText?: string
	}>(),
	{
		emptyText: "No content to show",
	}
)

const slots = useSlots()

const hasContent = computed(() => {
	const content = slots.default?.()

	if (!content) return false

	return content.some((node) => {
		if (node.type === Comment) return false

		if (typeof node.children === "string") {
			return node.children.trim().length > 0
		}

		return true
	})
})
</script>
