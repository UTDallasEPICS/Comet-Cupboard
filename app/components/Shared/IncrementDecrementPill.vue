<template>
	<div class="border-utd-green flex h-min gap-1 rounded-3xl">
		<div class="border-utd-green ml-auto flex w-fit items-center overflow-hidden rounded-md border bg-white">
			<SharedButtonActionButton
				action="neutral"
				button-variant="ghost"
				icon="i-lucide-minus"
				:ui="{
					base: 'rounded-none px-2 h-full',
				}"
				:disabled="props.count <= props.min"
				@click="emit('decrement')"
			/>
			<SharedTextBase class="w-10 text-center">{{ count }}</SharedTextBase>
			<SharedButtonActionButton
				action="neutral"
				button-variant="ghost"
				icon="i-lucide-plus"
				:ui="{
					base: 'rounded-none px-2 h-full',
				}"
				:disabled="props.count >= props.max"
				@click="emit('increment')"
			/>
		</div>
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
