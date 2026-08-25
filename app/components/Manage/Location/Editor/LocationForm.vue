<template>
	<SharedFormShell :validate="validate" :state="state" :on-submit="submit" :on-error="onError" width-class="w-full" class="space-y-4">
		<SharedLayoutSectionUCard title="Location Image">
			<UFormField name="image" v-bind="locationFormFields.image" required>
				<UFileUpload v-model="state.image" class="aspect-square w-full" label="Upload image" accept=".jpg,.jpeg,.png" />
			</UFormField>
		</SharedLayoutSectionUCard>
		<SharedLayoutSectionUCard title="Location Details">
			<UFormField name="locationName" v-bind="locationFormFields.locationName" required>
				<UInput v-model="state.locationName" :placeholder="locationFormFields.locationName.placeholder" />
				<div v-if="mostSimilarItems.length" class="border-border-soft mt-2 rounded-lg border p-2">
					<SharedTextBaseSecondary>Similar existing locations</SharedTextBaseSecondary>
					<div class="mt-2 flex flex-wrap gap-2">
						<UBadge v-for="location in mostSimilarItems" :key="location.locationID" :label="location.locationName" color="neutral" variant="soft" />
					</div>
					<SharedTextBaseSecondary class="mt-2 text-xs">Check that you're not creating a duplicate location.</SharedTextBaseSecondary>
				</div>
			</UFormField>
		</SharedLayoutSectionUCard>
		<SharedLayoutSectionUCard title="Description">
			<UFormField name="description" v-bind="locationFormFields.description">
				<UTextarea v-model="state.description" :placeholder="locationFormFields.description.placeholder" class="w-full" />
			</UFormField>
		</SharedLayoutSectionUCard>
		<SharedLayoutSectionUCard title="Map Details">
			<UFormField name="mapEmbedUrl" v-bind="locationFormFields.mapEmbedUrl">
				<UInput v-model="state.mapEmbedUrl" :placeholder="locationFormFields.mapEmbedUrl.placeholder" class="w-full" />
				<SharedButtonActionButton variant="link" color="primary" class="mt-2 px-0" @click="showMapDirections = true">
					<SharedIcon name="i-lucide-circle-help" class="mr-1" />
					Click for directions on getting this information
				</SharedButtonActionButton>
			</UFormField>
		</SharedLayoutSectionUCard>
		<SharedLayoutSectionUCard v-if="showArchived" title="Availability">
			<UFormField name="archived" v-bind="locationFormFields.archived">
				<UCheckbox v-model="state.archived" label="Archived" />
			</UFormField>
		</SharedLayoutSectionUCard>
		<SharedFormActions :submit-text="submitText" class-name="sticky right-4 bottom-8 mt-4" />
	</SharedFormShell>

	<UModal v-model:open="showMapDirections" title="How to Find the Campus Map URL">
		<template #body>
			<div class="space-y-4">
				<div class="space-y-2">
					<SharedTextCardTitle>Step 1</SharedTextCardTitle>
					<SharedTextBaseSecondary
						>Find the location on the UTD campus map that you want to link to and click the Share button.</SharedTextBaseSecondary
					>
					<img
						src="/CampusURLSharePart1.png"
						alt="Instructions for finding the UTD campus map location"
						class="border-border-soft w-full rounded-lg border"
					/>
				</div>
				<div class="space-y-2">
					<SharedTextCardTitle>Step 2</SharedTextCardTitle>
					<SharedTextBaseSecondary>Paste the URL section into the map URL input</SharedTextBaseSecondary>
					<img
						src="/CampusURLSharePart2.png"
						alt="Instructions for copying the UTD campus map URL"
						class="border-border-soft w-full rounded-lg border"
					/>
				</div>
			</div>
		</template>
	</UModal>
</template>

<script setup lang="ts">
import {
	createLocationSchema,
	editLocationSchema,
	createLocationFormFields,
	editLocationFormFields,
	type CreateLocationForm,
	type EditLocationForm,
} from "~/utils/formSchemas"

type LocationSummary = { locationID: string; locationName: string }
type LocationFormValues = CreateLocationForm | EditLocationForm

const props = withDefaults(defineProps<{ locations?: LocationSummary[]; initialValues: LocationFormValues; showArchived?: boolean; submitText?: string }>(), {
	locations: () => [],
	showArchived: false,
	submitText: "Submit",
})
const emit = defineEmits<{ submit: [payload: LocationFormValues] }>()
const locationFormFields = computed(() => (props.showArchived ? editLocationFormFields : createLocationFormFields))
const showMapDirections = ref(false)
const { state, validate, onError } = createFormBuilder(props.showArchived ? editLocationSchema : createLocationSchema, () => props.initialValues)
const { query, filtered } = useFuzzySearch(
	computed(() => props.locations),
	{ searchKeys: ["locationName"] }
)

watch(
	() => props.initialValues,
	(values) => Object.assign(state.value, values),
	{ deep: true }
)
watch(
	() => state.value.locationName,
	(name) => (query.value = name ?? ""),
	{ immediate: true }
)

const mostSimilarItems = computed(() => filtered.value.slice(0, 5))
const submit = (event: { data: LocationFormValues }) => emit("submit", event.data)
</script>
