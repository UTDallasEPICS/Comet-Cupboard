<template>
	<div class="flex flex-col justify-center gap-4">
		<div class="flex w-full max-w-100 flex-col">
			<UCard>
				<template #header>
					<header class="text-xl font-bold">Bag Details</header>
				</template>
				<div class="flex flex-col justify-between">
					<div class="flex gap-2">
						<p class="font-bold">Label:</p>
						<div class="flex items-center justify-center gap-1">
							<UBadge v-if="bagDetails.selectedCategory.length === 0" class="rounded-full bg-gray-400 font-bold" label="Neither" />

							<UBadge
								v-for="label in bagDetails.selectedCategory"
								:key="label"
								:label="label"
								:class="label === 'VEGETARIAN' ? 'rounded-full bg-green-700 font-bold' : 'rounded-full bg-yellow-600 font-bold'"
							/>
						</div>
					</div>
					<div class="flex gap-2">
						<p class="font-bold">Expiration Date:</p>
						<span>{{ bagDetails.expirationDate }}</span>
					</div>
					<div v-if="bagDetails.isPrivate" class="mb-4 flex flex-col">
						<div class="flex gap-2">
							<p class="font-bold">Privacy:</p>
							<p>Private</p>
						</div>
						<div class="flex flex-col">
							<p class="font-bold">Bag Description:</p>
							<div class="w-full">
								<span class="break-words">{{ bagDetails.bagDescription }}</span>
							</div>
						</div>
					</div>
				</div>
			</UCard>
		</div>

		<UCard>
			<template #header>
				<header class="text-xl font-bold">Items</header>
			</template>
			<div class="flex flex-col gap-4">
				<EmergencyBagConfirmItemCard
					v-for="item in bagItems"
					:key="item.itemID"
					:name="item.name"
					:img-name="item.imgName"
					:item-deal="item.itemDeal"
					:item-id="item.itemID"
					:item-count="item.count"
				/>
			</div>
		</UCard>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
	bagItems: {
		itemID: string
		count: number
		name: string
		imgName: string
	}
	bagDetails: {
		selectedCategory: []
		expirationDate: null
		isPrivate: null
		bagDescription: ""
	}
}>()
</script>
