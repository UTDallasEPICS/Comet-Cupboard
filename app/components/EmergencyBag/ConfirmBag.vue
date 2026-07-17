<template>
	<div class="flex flex-col justify-center gap-4">
		<div class="flex w-full max-w-100 flex-col">
			<UCard>
				<template #header>
					<h2 class="text-xl font-bold">Bag Details</h2>
				</template>
				<div class="flex flex-col justify-between">
					<div class="flex gap-2">
						<p class="font-bold">Label:</p>
						<span>{{ bagDetails.selectedCategory.join(", ") }}</span>
					</div>
					<div class="flex gap-2">
						<p class="font-bold">Expiration Date:</p>
						<span>{{ bagDetails.expirationDate }}</span>
					</div>
					<div class="flex gap-2 mb-4">
						<p class="font-bold">Privacy:</p>
						<span>{{ bagDetails.selectedPrivacy }}</span>
					</div>
					<div v-if="bagDetails.selectedPrivacy === 'PRIVATE'" class="flex flex-col">
						<p class="font-bold">Bag Description:</p>
						<div class="w-full">
							<span class="break-words">{{ bagDetails.bagDescription }}</span>
						</div>
					</div>
				</div>
			</UCard>
		</div>

		<UCard>
			<template #header>
				<h2 class="text-xl font-bold">Items</h2>
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
		selectedPrivacy: null
		bagDescription: ""
	}
}>()
</script>
