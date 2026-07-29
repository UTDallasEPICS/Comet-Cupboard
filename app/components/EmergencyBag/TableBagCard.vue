<template>
	<div class="flex w-full flex-col rounded-lg border border-gray-200 p-2">
		<div class="flex justify-between">
			<div class="flex items-center gap-2">
				<UCheckbox :model-value="selected" @update:model-value="emit('update:selected', $event)" />
				<div class="flex flex-col items-start">
					<div class="flex items-center gap-1">
						<UIcon v-if="props.bag.privacy === 'PRIVATE'" name="i-lucide-hat-glasses" />
						<span>{{ props.bag.label }}</span>
					</div>
					<span>{{ props.bag.expiryDate.split("T")[0] }}</span>

					<UBadge v-if="props.bag.isVegetarian === false && props.bag.hasPeanutButter === false" class="rounded-full bg-gray-400 font-bold"
						>Neither</UBadge
					>
					<div class="flex gap-1">
						<UBadge v-if="props.bag.isVegetarian === true" class="rounded-full bg-green-700 font-bold">Vegetarian</UBadge>
						<UBadge v-if="props.bag.hasPeanutButter === true" class="rounded-full bg-yellow-600 font-bold">Peanut Butter</UBadge>
					</div>
				</div>
			</div>

			<div class="flex flex-col items-end justify-between">
				<span>{{ props.bag.locationName ?? "Unassigned" }}</span>

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
				<div v-for="item in bag.EmergencyBagItems" :key="item.itemID" class="flex items-center justify-between pt-4">
					<div class="flex items-center gap-2">
						<img :src="`/api/public/image/${item.Item.imgName}`" :alt="item.Item.name" class="ml-2 aspect-square w-8 rounded-lg" />
						<span> {{ item.Item.name }}</span>
					</div>
					<span> Qty:{{ item.count }}</span>
				</div>
				<div class="max-w-sm rounded-lg p-2">
					<div v-if="props.bag.privacy === 'PRIVATE'">
						<span class="break-words"
							><span class="font-bold">Note:</span>
							{{ props.bag.bagDescription }}
						</span>
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
