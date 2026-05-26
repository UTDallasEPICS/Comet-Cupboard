<template>
	<div class="flex w-full items-center gap-3">
		<!-- Image -->
		<img v-if="item.imgName" :src="`/api/public/image/${item.imgName}`" :alt="item.name" class="h-10 w-10 rounded object-cover sm:h-12 sm:w-12" />
		<div v-else class="flex h-12 w-12 items-center justify-center rounded bg-gray-300">
			<span class="text-xs text-gray-500">No Img</span>
		</div>

		<!-- Name -->
		<div>
			<p class="text-sm font-semibold">{{ item.name }}</p>
		</div>

		<div class="ml-auto flex items-center gap-1">
			<UButton icon="i-lucide-minus" size="md" variant="soft" color="neutral" @click="$emit('decrease', item.itemID)" />
			<span class="w-8 text-center font-semibold tabular-nums">{{ item.count }}</span>
			<UButton icon="i-lucide-plus" size="md" variant="soft" color="neutral" @click="$emit('increase', item.itemID)" />
			<UButton icon="i-lucide-x" size="md" variant="soft" color="error" @click="$emit('remove', item.itemID)" />
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	item: {
		itemID: string
		count: number
		name: string
		imgName?: string
	}
}>()

defineEmits(["increase", "decrease", "remove"])
</script>
