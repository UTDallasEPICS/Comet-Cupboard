<template>
	<UForm :validate="validate" :state="state" class="w-full" @submit="onSubmit" @error="onError">
		<UCard>
			<SharedTextCardTitle>Item Details</SharedTextCardTitle>
			<USeparator class="my-4" />
			<div class="space-y-4">
				<UFormField id="itemName" name="itemName" label="Item Name" description="Use up to 100 letters and spaces" required>
					<UInput v-model="state.itemName" maxlength="100" placeholder="Enter item name" class="w-full" />
				</UFormField>
				<UFormField id="category" name="category" label="Category" description="Select the category for this item" required>
					<USelect v-model="state.categoryID" :items="categoryOptions" value-key="value" label-key="label" placeholder="Select category" class="w-full" />
				</UFormField>
				<UFormField id="archived" name="archived" label="Availability" description="Hide this item from active inventory and shopping">
					<UCheckbox v-model="state.archived" label="Archived" />
				</UFormField>
			</div>
			<div v-if="changesMade" class="mt-4 flex justify-end gap-2">
				<UButton type="button" label="Cancel" color="neutral" variant="outline" @click="cancelChanges" />
				<UButton type="submit" label="Save Changes" color="secondary" :loading="isSaving" />
			</div>
		</UCard>
	</UForm>
</template>

<script setup lang="ts">
import * as z from "zod"

const props = defineProps<{
	itemID: string
	originalName: string
	originalCategoryID: string
	originalArchived: boolean
	categoryOptions: { label: string; value: string }[]
}>()
const emit = defineEmits<{ updated: [] }>()

const formSchema = z.object({
	itemName: z.string().min(1, "Item name is required").max(100, "Item name must be at most 100 characters").regex(/^[A-Za-z ]+$/, "Item name must only contain letters and spaces"),
	categoryID: z.string().min(1, "Category is required"),
	archived: z.boolean(),
})
const { state, validate, onError } = createFormBuilder(formSchema, () => ({
	itemName: props.originalName,
	categoryID: props.originalCategoryID,
	archived: props.originalArchived,
}))
const isSaving = ref(false)
const changesMade = computed(() => state.value.itemName !== props.originalName || state.value.categoryID !== props.originalCategoryID || state.value.archived !== props.originalArchived)

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

const onSubmit = async (event: { data: z.infer<typeof formSchema> }) => {
	isSaving.value = true
	try {
		const formData = new FormData()
		formData.append("itemID", props.itemID)
		formData.append("itemName", event.data.itemName)
		formData.append("categoryID", event.data.categoryID)
		formData.append("archived", event.data.archived.toString())
		await $fetch("/api/volunteer/inventory/item", { method: "PUT", body: formData })
		emit("updated")
	} finally {
		isSaving.value = false
	}
}
</script>