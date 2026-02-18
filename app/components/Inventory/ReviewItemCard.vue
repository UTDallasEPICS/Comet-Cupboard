<template>
	<UCard
		class="relative min-w-72"
		:ui="{
			header: 'p-2 py-2 sm:p-2 sm:py-2',
			body: 'p-2 py-2 sm:p-2 sm:py-2',
		}"
	>
		<template #header>
			<div class="flex flex-row items-center justify-between px-2">
				<p class="truncate">{{ itemName }}</p>
			</div>
		</template>

		<div class="flex h-16 flex-row justify-between">
			<img :src="`/api/public/image/${imgName}`" :alt="itemName" class="ml-2 aspect-square h-full border border-black object-cover" />
			<div class="mt-auto flex flex-col items-end gap-2">
				<p class="">Current Qty: {{ adjustedCount }}</p>
				<p class="">Change: {{ changeInCount }}</p>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps({
	itemName: {
		type: String,
		default: "Item name",
	},
	itemCount: {
		type: Number,
		default: "#",
	},
	adjustedCount: {
		type: Number,
		default: "+??",
	},
	imgName: {
		type: String,
		default: "",
	},
})

const changeInCount = computed(() => {
	const dif = props.adjustedCount - props.itemCount
	return dif > 0 ? `+${dif}` : `${dif}`
})
</script>
