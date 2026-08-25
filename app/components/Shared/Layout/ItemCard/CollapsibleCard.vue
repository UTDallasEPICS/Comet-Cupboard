<template>
	<SharedLayoutItemCard>
		<div class="relative flex min-h-24 items-center gap-4 p-4">
			<slot name="image" />

			<div class="min-w-0">
				<slot name="content" />
			</div>

			<div v-if="$slots.actions" class="absolute top-2 right-2 flex items-center gap-2">
				<slot name="actions" />
			</div>

			<SharedButtonActionButton
				:trailing-icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
				size="sm"
				variant="ghost"
				action="neutral"
				class="absolute right-2 bottom-1"
				:label="label"
				:aria-label="ariaLabel || label"
				@click="open = !open"
			/>
		</div>

		<UCollapsible v-model:open="open">
			<template #content>
				<USeparator />

				<slot name="content-expanded" />
			</template>
		</UCollapsible>
	</SharedLayoutItemCard>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		modelValue?: boolean
		label?: string
		ariaLabel?: string
	}>(),
	{
		modelValue: false,
		label: "Show details",
		ariaLabel: undefined,
	}
)

const emit = defineEmits<{
	"update:modelValue": [value: boolean]
}>()

const open = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
})
</script>
