<template>
	<SharedFormShell :validate="validate" :state="state" :on-submit="submit" :on-error="onError" width-class="w-full">
		<SharedLayoutSectionUCard title="Item Details">
			<UFormField name="itemName" v-bind="createInventoryItemFormFields.itemName" required>
				<UInput v-model="state.itemName" maxlength="100" :placeholder="createInventoryItemFormFields.itemName.placeholder" />
				<div v-if="mostSimilarItems.length" class="border-border-soft mt-2 rounded-lg border p-2">
					<SharedTextBaseSecondary>Similar existing items</SharedTextBaseSecondary>
					<div class="mt-2 flex flex-wrap gap-2">
						<UBadge v-for="item in mostSimilarItems" :key="item.itemID" :label="item.itemName" color="neutral" variant="soft" />
					</div>
					<SharedTextBaseSecondary class="mt-2 text-xs">Check that you're not creating a duplicate item.</SharedTextBaseSecondary>
				</div>
			</UFormField>
		</SharedLayoutSectionUCard>
		<SharedFormActions submit-text="Submit" class-name="sticky right-4 bottom-8 mt-4" />
	</SharedFormShell>
</template>

<script setup lang="ts">
import { createInventoryItemSchema, createInventoryItemFormFields, type CreateInventoryItemForm } from "~/utils/formSchemas"

type ItemSummary = { itemID: string; itemName: string }
const props = withDefaults(defineProps<{ items?: ItemSummary[] }>(), { items: () => [] })
const emit = defineEmits<{ submit: [itemName: string] }>()

const { state, validate, onError } = createFormBuilder(createInventoryItemSchema, () => ({ itemName: "" }))
const { query, filtered } = useFuzzySearch(
	computed(() => props.items),
	{ searchKeys: ["itemName"] }
)
watch(
	() => state.value.itemName,
	(name) => (query.value = name ?? ""),
	{ immediate: true }
)
const mostSimilarItems = computed(() => filtered.value.slice(0, 10))
const submit = (event: { data: CreateInventoryItemForm }) => emit("submit", event.data.itemName)
</script>
