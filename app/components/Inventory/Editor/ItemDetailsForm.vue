<template>
	<SharedFormShell :validate="validate" :state="state" class="w-full" :on-submit="onSubmit" :on-error="onError">
		<SharedLayoutSectionUCard title="Item Details">
			<div class="space-y-4">
				<UFormField id="itemName" name="itemName" label="Item Name" description="Use up to 100 letters and spaces" required>
					<UInput v-model="state.itemName" maxlength="100" placeholder="Enter item name" class="w-full" />
				</UFormField>
				<UFormField id="category" name="category" label="Category" description="Select the category for this item" required>
					<USelect
						v-model="state.categoryID"
						:items="categoryOptions"
						value-key="value"
						label-key="label"
						placeholder="Select category"
						class="w-full"
					/>
				</UFormField>
				<UFormField id="archived" name="archived" label="Availability" description="Hide this item from active inventory and shopping">
					<UCheckbox v-model="state.archived" label="Archived" />
				</UFormField>
			</div>
			<div v-if="changesMade" class="mt-4 flex justify-end gap-2">
				<SharedButtonActionButton type="button" label="Cancel" color="neutral" variant="outline" @click="cancelChanges" />
				<SharedButtonActionButton type="submit" label="Save Changes" color="secondary" :loading="saving" />
			</div>
		</SharedLayoutSectionUCard>
	</SharedFormShell>
</template>

<script setup lang="ts">
import { inventoryItemDetailsSchema, type InventoryItemDetailsForm } from "~/utils/formSchemas"

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
