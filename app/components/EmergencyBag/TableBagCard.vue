<template>
	<div class="flex w-full flex-col rounded-lg border border-gray-200 p-2">
		<div class="flex justify-between">
			<div class="flex items-center gap-2">
				<UCheckbox :model-value="selected" @update:model-value="emit('update:selected', $event)" />
				<div class="flex flex-col items-start">
					<div class="flex items-center gap-1">
						<UIcon v-if="props.bag.privacy === 'PRIVATE'" name="i-lucide-hat-glasses" />
						<span class="font-bold">{{ props.bag.label }}</span>
					</div>
					<div class="flex items-center gap-1">
						<UIcon name="i-lucide-calendar" />
						<span> Expiration: {{ props.bag.expiryDate.split("T")[0] }}</span>
					</div>

					<UBadge v-if="props.bag.isVegetarian === false && props.bag.hasPeanutButter === false" class="rounded-full bg-gray-400 font-bold"
						>Neither</UBadge
					>
					<div class="flex gap-1">
						<UBadge v-if="props.bag.isVegetarian === true" class="bg-badge-vege rounded-full border border-green-500 font-bold text-green-950"
							>Vegetarian</UBadge
						>
						<UBadge v-if="props.bag.hasPeanutButter === true" class="bg-badge-pb rounded-full border border-amber-500 font-bold text-amber-800"
							>Peanut Butter</UBadge
						>
					</div>
				</div>
			</div>

			<div class="flex flex-col items-end justify-between">
				<UBadge leading-icon="i-lucide-map-pin" class="bg-gray-100 text-nowrap text-black">{{ props.bag.locationName ?? "Unassigned" }}</UBadge>

				<UButton
					class="w-min"
					color="neutral"
					variant="ghost"
					trailing-icon="i-lucide-chevron-down"
					:ui="{ trailingIcon: ['transition-transform duration-200', expand ? 'rotate-180' : ''] }"
					@click="expand = !expand"
				/>
			</div>
		</div>

		<UCollapsible v-model:open="expand">
			<template #content>
				<USeparator class="mt-2" />
				<p class="p-2 font-bold">Items ({{ bag.EmergencyBagItems.length }})</p>
				<ul class="grid gap-2 sm:grid-cols-1 lg:grid-cols-1">
					<div v-for="item in bag.EmergencyBagItems" :key="item.itemID" class="border-border-soft rounded-lg border">
						<div class="flex flex-row items-center gap-2 px-2">
							<img
								:src="`/api/public/image/${item.Item.imgName}`"
								:alt="item.Item.name"
								class="border-border-soft aspect-square w-15 rounded-l-lg"
							/>
							<div class="flex w-full flex-col p-2">
								<div class="flex flex-row items-center justify-between">
									<SharedTextCardTitle>{{ item.Item.name }}</SharedTextCardTitle>
								</div>

								<div class="flex flex-row items-center justify-between">
									<UBadge :label="`QTY: ${item.count}`" variant="outline" color="neutral" />
								</div>
							</div>
						</div>
					</div>
					<div v-if="props.bag.privacy === 'PUBLIC'" class="flex justify-end">
						<UButton
							label="Edit Bag"
							class="bg-utd-orange text-white"
							variant="outline"
							trailing-icon="i-lucide-square-pen"
							@click="navigateTo(`/volunteer/emergency-bag/${props.bag.bagID}/edit`)"
						/>
					</div>
				</ul>
				<div class="mt-2 max-w-sm">
					<div v-if="props.bag.privacy === 'PRIVATE'">
						<UAlert :icon="icons['information']" :title="props.bag.bagDescription" color="neutral" variant="outline" class="border-blue-400 bg-blue-50 p-2" />
						

						<div class="flex justify-end pt-2">
							<UButton
								label="Edit Bag"
								class="bg-utd-orange text-white"
								variant="outline"
								trailing-icon="i-lucide-square-pen"
								@click="navigateTo(`/volunteer/emergency-bag/${props.bag.bagID}/edit`)"
							/>
						</div>
					</div>
				</div>
			</template>
		</UCollapsible>
	</div>
</template>

<script lang="ts" setup>
const expand = ref(false)
const emit = defineEmits<{
	"update:selected": [value: boolean]
}>()

const props = defineProps<{
	bag: {
		bagID: string
		label: string
		expiryDate: Date
		locationName: string | null
		isVegetarian: boolean
		hasPeanutButter: boolean
		privacy: string
		bagDescription: string
		EmergencyBagItems: {
			Item: {
				name: string
				imgName: string
			}
			itemID: string
			count: number
		}[]
	}
	selected: boolean
}>()
</script>
