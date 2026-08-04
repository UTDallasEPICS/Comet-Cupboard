<template>
	<UCard class="flex w-28 items-center justify-center">
		<div class="flex flex-col items-center">
			<img :src="`/api/public/image/${imgName}`" :alt="name" class="border-border-soft items-center aspect-square h-full w-16 rounded-lg border object-cover" />
			<img src="" alt="" />
			<p class="mb-2">{{ props.name }}</p>
			<p>Qty: {{ props.itemCount }}</p>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps<{
	name: string
	imgName: string
	itemID: string
	itemDeal: Object
	itemCount: Number
}>()
</script>
