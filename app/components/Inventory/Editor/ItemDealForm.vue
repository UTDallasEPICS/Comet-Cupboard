<template>
	<SharedLayoutSectionUCard title="Deal">
		<URadioGroup v-model="selectedDealOption" :items="dealOptions" />
		<div v-if="selectedDealOption === 'Deal is X for Y'" class="mt-4 grid gap-4 sm:grid-cols-2">
			<UFormField v-bind="dealFormFields.actualCount"><UInputNumber v-model="actualCount" :min="1" /></UFormField>
			<UFormField v-bind="dealFormFields.adjustedCount"><UInputNumber v-model="adjustedCount" :min="0" /></UFormField>
		</div>
		<SharedFormActions v-if="changesMade" submit-text="Save Changes" class-name="mt-4">
			<template #cancel>
				<SharedButtonActionButton label="Cancel" color="neutral" variant="outline" @click="cancelChanges" />
			</template>
			<SharedButtonActionButton label="Save Changes" color="secondary" :loading="saving" @click="saveDeal" />
		</SharedFormActions>
	</SharedLayoutSectionUCard>
</template>

<script setup lang="ts">
import { dealFormFields } from "~/utils/formSchemas"
const props = defineProps<{
	itemID: string
	originalDeal: { actualCount: number; adjustedCount: number } | null
	saving?: boolean
}>()
const emit = defineEmits<{ save: [deal: { actualCount: number; adjustedCount: number } | null] }>()

const dealOptions = ["No deal", "Deal is X for Y", "Free deal"]
const selectedDealOption = ref("No deal")
const actualCount = ref(2)
const adjustedCount = ref(1)
const originalOption = computed(() =>
	!props.originalDeal ? "No deal" : props.originalDeal.actualCount === 1 && props.originalDeal.adjustedCount === 0 ? "Free deal" : "Deal is X for Y"
)
const changesMade = computed(
	() =>
		selectedDealOption.value !== originalOption.value ||
		(selectedDealOption.value === "Deal is X for Y" &&
			(actualCount.value !== props.originalDeal?.actualCount || adjustedCount.value !== props.originalDeal?.adjustedCount))
)

const cancelChanges = () => {
	selectedDealOption.value = originalOption.value
	actualCount.value = props.originalDeal?.actualCount ?? 2
	adjustedCount.value = props.originalDeal?.adjustedCount ?? 1
}

watch(
	() => props.originalDeal,
	(_, previousDeal) => {
		if (previousDeal === undefined || !changesMade.value) cancelChanges()
	},
	{ immediate: true }
)

const saveDeal = () => {
	if (selectedDealOption.value === "Deal is X for Y" && actualCount.value <= adjustedCount.value) return
	emit(
		"save",
		selectedDealOption.value === "No deal"
			? null
			: {
					actualCount: selectedDealOption.value === "Free deal" ? 1 : actualCount.value,
					adjustedCount: selectedDealOption.value === "Free deal" ? 0 : adjustedCount.value,
				}
	)
}
</script>
