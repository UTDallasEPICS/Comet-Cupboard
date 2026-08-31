<template>
	<SharedFormShell :validate="validate" :state="state" class="w-full" :on-submit="onSubmit" :on-error="onError">
		<SharedLayoutSectionUCard title="Source Details">
			<div class="space-y-4">
				<SharedTextBaseSecondary class="font-mono">Source ID: {{ props.sourceID }}</SharedTextBaseSecondary>
				<UFormField name="sourceName" v-bind="sourceDetailsFormFields.sourceName" required>
					<UInput v-model="state.sourceName" :placeholder="sourceDetailsFormFields.sourceName.placeholder" class="w-full" />
				</UFormField>
				<UFormField name="archived" v-bind="sourceDetailsFormFields.archived">
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
import { sourceDetailsSchema, sourceDetailsFormFields, type SourceDetailsForm } from "#shared/utils/formSchemas"

const props = defineProps<{
	sourceID: string
	originalName: string
	originalArchived: boolean
	saving?: boolean
}>()
const emit = defineEmits<{ save: [payload: SourceDetailsForm] }>()
const { state, validate, onError } = createFormBuilder(sourceDetailsSchema, () => ({ sourceName: props.originalName, archived: props.originalArchived }))
const changesMade = computed(() => state.value.sourceName !== props.originalName || state.value.archived !== props.originalArchived)

watch(
	() => [props.originalName, props.originalArchived],
	() => {
		if (!changesMade.value) {
			state.value.sourceName = props.originalName
			state.value.archived = props.originalArchived
		}
	}
)

const cancelChanges = () => {
	state.value.sourceName = props.originalName
	state.value.archived = props.originalArchived
}
const onSubmit = (event: { data: SourceDetailsForm }) => {
	emit("save", event.data)
}
</script>
