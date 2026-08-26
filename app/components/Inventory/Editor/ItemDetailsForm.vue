<template>
	<SharedFormShell :validate="validate" :state="state" class="w-full" :on-submit="onSubmit" :on-error="onError">
		<SharedLayoutSectionUCard title="Item Details">
			<div class="space-y-4">
				<UFormField name="itemName" v-bind="inventoryItemDetailsFormFields.itemName" required>
					<UInput v-model="state.itemName" maxlength="100" :placeholder="inventoryItemDetailsFormFields.itemName.placeholder" class="w-full" />
				</UFormField>
				<UFormField name="categoryID" v-bind="inventoryItemDetailsFormFields.categoryID" required>
					<USelect
						v-model="state.categoryID"
						:items="categoryOptions"
						value-key="value"
						label-key="label"
						:placeholder="inventoryItemDetailsFormFields.categoryID.placeholder"
						class="w-full"
					/>
				</UFormField>
				<UFormField name="archived" v-bind="inventoryItemDetailsFormFields.archived">
					<UCheckbox v-model="state.archived" label="Archived" />
				</UFormField>
			</div>
			<SharedFormActions v-if="changesMade" submit-text="Save Changes" class-name="mt-4">
				<template #cancel>
					<SharedButtonActionButton type="button" text="Cancel" action="cancel" " @click="cancelChanges" />
				</template>
				<SharedButtonActionButton type="submit" text="Save Changes" leading-icon="i-lucide-check" action="positive" :loading="saving" />
			</SharedFormActions>
		</SharedLayoutSectionUCard>
	</SharedFormShell>
</template>

<script setup lang="ts">
import { inventoryItemDetailsSchema, inventoryItemDetailsFormFields, type InventoryItemDetailsForm } from "#shared/utils/formSchemas"

const props = defineProps<{
	itemID: string
	originalName: string
	originalCategoryID: string
	originalArchived: boolean
	categoryOptions: { label: string; value: string }[]
	saving?: boolean
}>()
const emit = defineEmits<{ save: [payload: InventoryItemDetailsForm] }>()
const { state, validate, onError } = createFormBuilder(inventoryItemDetailsSchema, () => ({
	itemName: props.originalName,
	categoryID: props.originalCategoryID,
	archived: props.originalArchived,
}))
const changesMade = computed(
	() => state.value.itemName !== props.originalName || state.value.categoryID !== props.originalCategoryID || state.value.archived !== props.originalArchived
)

watch(
	() => [props.originalName, props.originalCategoryID, props.originalArchived],
	() => {
		if (!changesMade.value) cancelChanges()
	}
)

const cancelChanges = () => {
	state.value.itemName = props.originalName
	state.value.categoryID = props.originalCategoryID
	state.value.archived = props.originalArchived
}

const onSubmit = (event: { data: InventoryItemDetailsForm }) => {
	emit("save", event.data)
}
</script>
