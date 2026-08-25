<template>
	<SharedFormShell :validate="validate" :state="state" :on-submit="submit" :on-error="onError" width-class="w-full" class="space-y-4">
		<SharedLayoutSectionUCard title="Category Image">
			<UFormField
				id="image"
				name="image"
				label="Category Image"
				description="JPG or PNG. 2MB Max. Dimensions between 200x200 and 4096x4096 pixels"
				required
			>
				<UFileUpload v-model="state.image" class="aspect-square w-full" label="Upload image" accept=".jpg,.jpeg,.png" />
			</UFormField>
		</SharedLayoutSectionUCard>
		<SharedLayoutSectionUCard title="Category Details">
			<UFormField
				id="categoryName"
				name="categoryName"
				label="Category Name"
				description="Category name must be at most 20 characters and only contain letters and spaces"
				required
			>
				<UInput v-model="state.categoryName" placeholder="Enter category name" />
				<div v-if="mostSimilarItems.length" class="border-border-soft mt-2 rounded-lg border p-2">
					<SharedTextBaseSecondary>Similar existing categories</SharedTextBaseSecondary>
					<div class="mt-2 flex flex-wrap gap-2">
						<UBadge v-for="category in mostSimilarItems" :key="category.categoryID" :label="category.categoryName" color="neutral" variant="soft" />
					</div>
					<SharedTextBaseSecondary class="mt-2 text-xs">Check that you're not creating a duplicate category.</SharedTextBaseSecondary>
				</div>
			</UFormField>
		</SharedLayoutSectionUCard>
		<SharedLayoutSectionUCard v-if="showArchived" title="Availability">
			<UFormField id="archived" name="archived" label="Archived" description="Check if the category is archived">
				<UCheckbox v-model="state.archived" label="Archived" />
			</UFormField>
		</SharedLayoutSectionUCard>
		<SharedFormActions :submit-text="submitText" class-name="sticky right-4 bottom-8 mt-4" />
	</SharedFormShell>
</template>

<script setup lang="ts">
import { createCategorySchema, editCategorySchema, type CreateCategoryForm, type EditCategoryForm } from "~/utils/formSchemas"

type CategorySummary = { categoryID: string; categoryName: string }
type CategoryFormValues = CreateCategoryForm | EditCategoryForm

const props = withDefaults(defineProps<{ categories?: CategorySummary[]; initialValues: CategoryFormValues; showArchived?: boolean; submitText?: string }>(), {
	categories: () => [],
	showArchived: false,
	submitText: "Submit",
})
const emit = defineEmits<{ submit: [payload: CategoryFormValues] }>()
const { state, validate, onError } = createFormBuilder(props.showArchived ? editCategorySchema : createCategorySchema, () => props.initialValues)
const { query, filtered } = useFuzzySearch(
	computed(() => props.categories),
	{ searchKeys: ["categoryName"] }
)

watch(
	() => props.initialValues,
	(values) => Object.assign(state.value, values),
	{ deep: true }
)
watch(
	() => state.value.categoryName,
	(name) => (query.value = name ?? ""),
	{ immediate: true }
)

const mostSimilarItems = computed(() => filtered.value.slice(0, 5))
const submit = (event: { data: CategoryFormValues }) => emit("submit", event.data)
</script>
