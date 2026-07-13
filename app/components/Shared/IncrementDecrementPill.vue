<template>
	<div class="border-utd-green flex h-min gap-1 rounded-3xl">
		<UButton
			:icon="icons['subtract']"
			size="xs"
			variant="solid"
			class="bg-utd-green disabled:bg-cancel-gray rounded-3xl"
			:disabled="props.count <= props.min"
			@click="emit('decrement')"
		/>
		<SharedTextBase class="h-6 w-8 text-center">{{ props.count }}</SharedTextBase>
		<UButton
			:icon="icons['add']"
			size="xs"
			variant="solid"
			class="bg-utd-green disabled:bg-cancel-gray rounded-3xl"
			:disabled="props.count >= props.max"
			@click="emit('increment')"
		/>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	count: { type: Number, default: 0 },
	min: { type: Number, default: 1 },
	max: { type: Number, default: 99 },
})

const emit = defineEmits(["increment", "decrement"])
</script>
