<template>
	<div class="flex flex-col justify-center gap-4">
		<div class="flex w-full max-w-100 flex-col">
			<SharedFormCard>
				<template #header>
					<header class="text-xl font-bold">Bag Details</header>
				</template>
				<div class="flex flex-col justify-between">
					<div class="flex gap-2">
						<SharedTextBase class="font-bold">Label:</SharedTextBase>
						<div class="flex items-center justify-center gap-1">
							<UBadge v-if="props.bagDetails.labels.length === 0" class="rounded-full bg-gray-400 font-bold" label="Neither" />

							<SharedLabel v-for="label in props.bagDetails.labels" :key="label" :label="label" />
						</div>
					</div>
					<div class="flex gap-2">
						<SharedTextBase class="font-bold">Expiration Date:</SharedTextBase>
						<SharedTextBase>{{ props.bagDetails.expirationDate }}</SharedTextBase>
					</div>
					<div v-if="props.bagDetails.private" class="mb-4 flex flex-col">
						<div class="flex gap-2">
							<SharedTextBase class="font-bold">Privacy:</SharedTextBase>
							<SharedTextBase>Private</SharedTextBase>
						</div>
						<div class="flex flex-col">
							<SharedTextBase class="font-bold">Bag Description:</SharedTextBase>
							<div class="w-full">
								<SharedTextBase class="wrap-break-word">{{ props.bagDetails.bagDescription }}</SharedTextBase>
							</div>
						</div>
					</div>
				</div>
			</SharedFormCard>
		</div>

		<SharedFormCard>
			<template #header>
				<header class="text-xl font-bold">Items</header>
			</template>
			<div class="flex flex-col gap-4">
				<DomainCardEmergencyBagConfirmItemCard
					v-for="item of displayItems"
					:key="item.specificItemID"
					:name="item.name"
					:product-name="item.productName"
					:img-name="item.imgName"
					:item-i-d="item.specificItemID"
					:item-count="item.count"
					:item-labels="item.itemLabels"
				/>
			</div>
		</SharedFormCard>
	</div>
</template>

<script lang="ts" setup>
type BagItem = {
	specificItemID: string
	count: number
	name: string
	productName: string
	imgName: string
	itemLabels: string[]
}

type BagDetails = {
	labels: string[]
	expirationDate: unknown
	private: boolean
	bagDescription: string
}

const props = defineProps<{
	bagItems: BagItem[]
	bagDetails: BagDetails
}>()

const displayItems = computed<BagItem[]>(() => props.bagItems)
</script>
