<template>
	<UCard>
		<template #header>
			<p>{{ name }}</p>
		</template>

		<div class="flex flex-row gap-x-4">
			<div class="relative h-24 w-24 shrink-0">
				<img :src="`/api/public/image/${imgName}`" class="h-full w-full rounded-lg object-cover" />

				<UBadge v-if="dealExists" variant="solid" size="lg" class="absolute top-0 left-0 rounded-tl-lg rounded-br-lg">
					{{ dealText }}
				</UBadge>
			</div>

			<div class="flex w-full flex-col justify-between">
				<div>
					<div class="flex justify-between font-bold">
						<p>Total QTY</p>
						<p class="w-12 text-right">{{ totalQTY }}</p>
					</div>
					<div v-if="detailed" class="flex justify-between">
						<p>Deals</p>
						<p v-if="dealCount !== 0" class="text-final-negative-red w-12 text-right">-{{ dealCount }}</p>
					</div>
					<div v-if="detailed" class="flex justify-between">
						<p>Expired</p>
						<p v-if="expiredCount !== 0" class="text-final-negative-red w-12 text-right">-{{ expiredCount }}</p>
					</div>
				</div>

				<USeparator v-if="detailed" />
				<div v-if="detailed" class="flex justify-between">
					<p>Adjusted QTY</p>
					<p class="w-12 text-right">{{ adjustedQTY }}</p>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
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
		required: false,
		default: () => {
			return {}
		},
	},
	totalQTY: {
		type: Number,
		required: true,
	},
	dealCount: {
		type: Number,
		required: true,
	},
	expiredCount: {
		type: Number,
		required: true,
	},
	adjustedQTY: {
		type: Number,
		required: true,
	},
	detailed: {
		type: Boolean,
		required: false,
		default: false,
	},
})

const dealExists = computed(() => {
	return Object.keys(props.itemDeal).includes("actualCount") && Object.keys(props.itemDeal).includes("adjustedCount")
})

const dealText = computed(() => {
	if (!dealExists.value) {
		return ""
	}
	if (props.itemDeal.actualCount == 1 && props.itemDeal.adjustedCount == 0) {
		return "FREE"
	}
	return `${props.itemDeal.actualCount} for ${props.itemDeal.adjustedCount}`
})
</script>
