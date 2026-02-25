<template>
	<UCard
		class="border-final-border-soft relative min-w-72 shadow-md"
		:ui="{
			header: 'p-2 py-2 sm:p-2 sm:py-2',
			body: 'p-2 py-2 sm:p-2 sm:py-2',
		}"
	>
		<template #header>
			<div class="flex flex-row justify-between px-2">
				<SharedTextCardTitle>{{ name }}</SharedTextCardTitle>
				<div class="flex items-center gap-2">
					<UBadge v-if="dealType === 'free'" label="Free" />
					<UBadge v-else-if="dealType === 'deal'" :label="`${props.itemDeal.actualCount} for ${props.itemDeal.adjustedCount}`" />
					<slot name="header-actions" />
				</div>
			</div>
		</template>

		<div class="flex flex-row justify-between">
			<img
				:src="`/api/public/image/${imgName}`"
				:alt="name"
				class="border-final-border-soft ml-2 aspect-square h-full w-16 rounded-lg border object-cover"
			/>
			<slot name="body" />
		</div>
	</UCard>
</template>

<script setup>
const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	imgName: {
		type: String,
		required: true,
	},
	itemID: {
		type: String,
		required: true,
	},
	itemDeal: {
		type: Object,
		default: () => ({}),
	},
})

const dealType = computed(() => {
	if (!props.itemDeal || !("actualCount" in props.itemDeal) || !("adjustedCount" in props.itemDeal)) {
		return null
	}
	if (props.itemDeal.actualCount === 1 && props.itemDeal.adjustedCount === 0) {
		return "free"
	}
	return "deal"
})
</script>
