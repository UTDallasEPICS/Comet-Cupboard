<template>
	<SharedFormShell :validate="validate" :state="state" :on-submit="saveDeal" :on-error="onError" width-class="w-full">
		<SharedLayoutSectionUCard title="Deal">
			<URadioGroup v-model="selectedDealOption" :items="dealOptions" />
			<div v-if="selectedDealOption === 'Deal is X for Y'" class="mt-4 grid gap-4 sm:grid-cols-2">
				<UFormField name="actualCount" v-bind="dealFormFields.actualCount"><UInputNumber v-model="state.actualCount" :min="1" /></UFormField>
				<UFormField name="adjustedCount" v-bind="dealFormFields.adjustedCount"><UInputNumber v-model="state.adjustedCount" :min="0" /></UFormField>
			</div>
			<SharedFormActions v-if="changesMade" submit-text="Save Changes" class-name="mt-4">
				<template #cancel>
					<SharedButtonActionButton type="button" text="Cancel" action="cancel" @click="cancelChanges" />
				</template>
				<SharedButtonActionButton type="submit" text="Save Changes" leading-icon="i-lucide-check" action="positive" :loading="saving" />
			</SharedFormActions>
		</SharedLayoutSectionUCard>
	</SharedFormShell>
</template>

<script setup lang="ts">
import { dealFormFields, dealSchema } from "#shared/utils/formSchemas"
const props = defineProps<{
	itemID: string
	originalDeal: { actualCount: number; adjustedCount: number } | null
	saving?: boolean
}>()
const emit = defineEmits<{ save: [deal: { actualCount: number; adjustedCount: number } | null] }>()

const dealOptions = ["No deal", "Deal is X for Y", "Free deal"]
const { state, validate, onError } = createFormBuilder(dealSchema, () => ({ actualCount: 2, adjustedCount: 1 }))
const selectedDealOption = ref("No deal")
const originalOption = computed(() =>
	!props.originalDeal ? "No deal" : props.originalDeal.actualCount === 1 && props.originalDeal.adjustedCount === 0 ? "Free deal" : "Deal is X for Y"
)
const changesMade = computed(
	() =>
		selectedDealOption.value !== originalOption.value ||
		(selectedDealOption.value === "Deal is X for Y" &&
			(state.value.actualCount !== props.originalDeal?.actualCount || state.value.adjustedCount !== props.originalDeal?.adjustedCount))
)

const cancelChanges = () => {
	selectedDealOption.value = originalOption.value
	state.value.actualCount = props.originalDeal?.actualCount ?? 2
	state.value.adjustedCount = props.originalDeal?.adjustedCount ?? 1
}

watch(
	() => props.originalDeal,
	(_, previousDeal) => {
		if (previousDeal === undefined || !changesMade.value) cancelChanges()
	},
	{ immediate: true }
)

const saveDeal = (event: { data: { actualCount: number; adjustedCount: number } }) => {
	const { actualCount, adjustedCount } = event.data
	emit(
		"save",
		selectedDealOption.value === "No deal"
			? null
			: {
					actualCount: selectedDealOption.value === "Free deal" ? 1 : actualCount,
					adjustedCount: selectedDealOption.value === "Free deal" ? 0 : adjustedCount,
				}
	)
}
</script>
