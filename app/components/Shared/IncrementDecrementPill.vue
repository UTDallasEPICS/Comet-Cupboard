<template>
	<div class="border-utd-green flex h-min gap-1 rounded-3xl">
		<div class="border-utd-green ml-auto flex w-fit items-center overflow-hidden rounded-md border bg-white">
			<SharedButtonBaseCustomColor
				custom-color="utd-green"
				content-color="white"
				button-variant="ghost"
				:ui="{
					base: 'rounded-none px-2 h-full',
				}"
				:icon="icons.subtract"
				size="sm"
				:disabled="props.count <= props.min"
				@click="emit('decrement')"
			/>
			<SharedTextBase class="w-10 text-center">{{ count }}</SharedTextBase>
			<SharedButtonBaseCustomColor
				custom-color="utd-green"
				content-color="white"
				button-variant="ghost"
				:ui="{
					base: 'rounded-none px-2 h-full',
				}"
				:icon="icons.add"
				size="sm"
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
