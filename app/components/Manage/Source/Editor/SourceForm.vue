<template>
	<SharedFormShell :validate="validate" :state="state" :on-submit="submit" :on-error="onError" width-class="w-full">
		<SharedLayoutSectionUCard title="Source Details">
			<UFormField name="sourceName" v-bind="sourceFormFields.sourceName">
				<UInput v-model="state.sourceName" :placeholder="sourceFormFields.sourceName.placeholder" class="w-full" />

				<div v-if="mostSimilarItems.length" class="border-border-soft mt-2 rounded-lg border p-2">
					<SharedTextBaseSecondary> Similar existing sources </SharedTextBaseSecondary>

					<div class="mt-2 flex flex-wrap gap-2">
						<UBadge v-for="source in mostSimilarItems" :key="source.sourceID" :label="source.sourceName" color="neutral" variant="soft" />
					</div>

					<SharedTextBaseSecondary class="mt-2 text-xs"> Check that you're not creating a duplicate source. </SharedTextBaseSecondary>
				</div>
			</UFormField>
		</SharedLayoutSectionUCard>

		<SharedFormActions :submit-text="submitText" class-name="sticky right-4 bottom-8 mt-4" />
	</SharedFormShell>
</template>

<script setup lang="ts">
import { sourceSchema, sourceFormFields, type SourceForm } from "#shared/utils/formSchemas"

type SourceSummary = {
	sourceID: string
	sourceName: string
}

const props = withDefaults(
	defineProps<{
		sources?: SourceSummary[]
		initialName?: string
		submitText?: string
	}>(),
	{
		sources: () => [],
		initialName: "",
		submitText: "Submit",
	}
)

const emit = defineEmits<{
	submit: [sourceName: string]
}>()

const { state, validate, onError } = createFormBuilder(sourceSchema, () => ({
	sourceName: props.initialName,
}))

watch(
	() => props.initialName,
	(name) => {
		state.value.sourceName = name
	}
)

const { query, filtered } = useFuzzySearch(
	computed(() => props.sources),
	{
		searchKeys: ["sourceName"],
	}
)

watch(
	() => state.value.sourceName,
	(name) => {
		query.value = name ?? ""
	},
	{
		immediate: true,
	}
)

const mostSimilarItems = computed(() => filtered.value.slice(0, 5))

const submit = (event: { data: SourceForm }) => {
	emit("submit", event.data.sourceName)
}
</script>
