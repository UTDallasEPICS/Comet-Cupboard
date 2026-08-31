<template>
	<div class="flex w-full flex-col rounded-lg border border-gray-200 p-2">
		<div class="flex justify-between">
			<div class="flex items-center gap-2">
				<UCheckbox :model-value="selected" @update:model-value="emit('update:selected', $event)" />
				<div class="flex flex-col items-start">
					<div class="flex items-center gap-1">
						<SharedIcon v-if="props.bag.private" name="i-lucide-hat-glasses" />
						<SharedTextBase class="font-bold">{{ props.bag.label }}</SharedTextBase>
					</div>
					<div class="flex items-center gap-1">
						<SharedIcon name="i-lucide-calendar" />
						<SharedTextBase> Expiration: {{ props.bag.expiryDate.split("T")[0] }}</SharedTextBase>
					</div>

					<SharedLabel v-if="activeEmergencyBagLabels.length === 0" label="No Labels" />
					<div class="flex flex-wrap gap-1">
						<SharedLabel
							v-for="emergencyBagLabel in activeEmergencyBagLabels"
							:key="emergencyBagLabel.emergencyBagLabelID"
							:label="emergencyBagLabel.emergencyBagLabelName"
							:color="emergencyBagLabel.color"
						/>
					</div>
				</div>
			</div>

			<div class="flex flex-col items-end justify-between">
				<UBadge leading-icon="i-lucide-map-pin" class="bg-gray-100 text-nowrap text-black">{{
					props.bag.location?.locationName ?? "Unassigned"
				}}</UBadge>

				<SharedButtonActionButton
					class="w-min"
					action="neutral"
					button-variant="ghost"
					trailing-icon="i-lucide-chevron-down"
					:ui="{ trailingIcon: ['transition-transform duration-200', expand ? 'rotate-180' : ''] }"
					@click="expand = !expand"
				/>
			</div>
		</div>

		<UCollapsible v-model:open="expand">
			<template #content>
				<USeparator class="mt-2" />
				<SharedTextBase class="p-2 font-bold">Items ({{ bag.emergencyBagItems.length }})</SharedTextBase>
				<SharedLayoutGrid :columns="1" class="gap-2">
					<div v-for="item in bag.emergencyBagItems" :key="item.specificItemID" class="border-border-soft rounded-lg border">
						<div class="flex flex-row items-center gap-2 px-2">
							<img
								:src="`/api/public/image/${item.specificItem.imgName}`"
								:alt="`${item.specificItem.item.itemName} (${item.specificItem.productName})`"
								class="border-border-soft aspect-square w-15 rounded-l-lg"
							/>
							<div class="flex w-full flex-col p-2">
								<div class="flex flex-row items-center justify-between">
									<SharedTextCardTitle>{{ item.specificItem.item.itemName }} ({{ item.specificItem.productName }})</SharedTextCardTitle>
								</div>

								<div class="flex flex-row items-center justify-between">
									<UBadge :label="`QTY: ${item.count}`" variant="outline" color="neutral" />
								</div>
								<div v-if="item.specificItem.itemLabels.length" class="mt-1 flex flex-wrap gap-1">
									<SharedLabel
										v-for="label in item.specificItem.itemLabels.filter((label) => !label.archived)"
										:key="label.itemLabelName"
										:label="label.itemLabelName"
										:color="label.color"
									/>
								</div>
							</div>
						</div>
					</div>
				</SharedLayoutGrid>
				<div class="mt-2 max-w-sm">
					<UAlert
						v-if="props.bag.private"
						icon="i-lucide-info"
						:title="props.bag.bagDescription"
						color="neutral"
						variant="outline"
						class="border-blue-400 bg-blue-50 p-2"
					/>
				</div>
				<div class="flex justify-end gap-2 p-2">
					<SharedButtonActionButton
						text="Edit Bag"
						action="positive"
						leading-icon="i-lucide-square-pen"
						@click="navigateTo(`/volunteer/emergency-bag/${props.bag.emergencyBagID}/edit`)"
					/>
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
		emergencyBagID: string
		label: string
		expiryDate: string
		location: { locationID: string; locationName: string } | null
		private: boolean
		bagDescription: string
		emergencyBagLabels: { emergencyBagLabelID: string; emergencyBagLabelName: string; color: string; archived: boolean }[]
		emergencyBagItems: {
			specificItem: {
				specificItemID: string
				productName: string
				imgName: string
				itemLabels: { itemLabelName: string; color: string; archived: boolean }[]
				item: {
					itemName: string
				}
			}
			specificItemID: string
			count: number
		}[]
	}
	selected: boolean
}>()

const activeEmergencyBagLabels = computed(() => props.bag.emergencyBagLabels.filter((label) => !label.archived))
</script>
