<template>
	<div class="space-y-4">
		<div class="flex items-center justify-between gap-3">
			<SharedTextCardTitle>Start Intake Session</SharedTextCardTitle>
			<SharedButtonActionButton
				icon="i-lucide-arrow-left"
				action="neutral"
				variant="ghost"
				aria-label="Back to intake sessions"
				@click="emit('cancel')"
			/>
		</div>
		<SharedFormShell :state="state" :validate="validate" class="space-y-4" :on-submit="startSession" :on-error="onError">
			<SharedLayoutSectionUCard title="Session Details">
				<div class="space-y-4">
					<UFormField name="inventoryIntakeSessionName" v-bind="intakeSessionFormFields.inventoryIntakeSessionName" required
						><UInput
							v-model="state.inventoryIntakeSessionName"
							:placeholder="intakeSessionFormFields.inventoryIntakeSessionName.placeholder"
							class="w-full"
					/></UFormField>
					<UFormField name="intakeDate" v-bind="intakeSessionFormFields.intakeDate" required
						><UInput v-model="state.intakeDate" type="date" class="w-full"
					/></UFormField>
					<UFormField name="notes" v-bind="intakeSessionFormFields.notes"
						><UTextarea v-model="state.notes" :placeholder="intakeSessionFormFields.notes.placeholder" class="w-full"
					/></UFormField>
				</div>
			</SharedLayoutSectionUCard>
			<SharedLayoutSectionUCard title="Source Information">
				<div class="space-y-4">
					<UFormField name="sourceID" v-bind="intakeSessionFormFields.sourceID" required
						><USelect
							v-model="state.sourceID"
							:items="sources"
							value-key="sourceID"
							label-key="sourceName"
							placeholder="Select source"
							class="w-full"
					/></UFormField>
					<UFormField v-for="field in sourceFields" :key="field.fieldID" :id="field.fieldID" :label="field.fieldName" :required="!field.optional">
						<UInput
							v-if="field.type === 'TEXT'"
							:model-value="textMetadataValue(field.fieldName)"
							:required="!field.optional"
							class="w-full"
							@update:model-value="setTextMetadata(field.fieldName, $event)"
						/>
						<UInput
							v-else-if="field.type === 'NUMBER'"
							:model-value="textMetadataValue(field.fieldName)"
							type="number"
							:required="!field.optional"
							class="w-full"
							@update:model-value="setTextMetadata(field.fieldName, $event)"
						/>
						<UInput
							v-else-if="field.type === 'DATE'"
							:model-value="textMetadataValue(field.fieldName)"
							type="date"
							:required="!field.optional"
							class="w-full"
							@update:model-value="setTextMetadata(field.fieldName, $event)"
						/>
						<UCheckbox v-else-if="field.type === 'BOOLEAN'" v-model="booleanMetadata[field.fieldName]" :label="field.fieldName" />
						<USelect
							v-else
							:model-value="textMetadataValue(field.fieldName)"
							:items="choiceItems(field)"
							:required="!field.optional"
							class="w-full"
							@update:model-value="setTextMetadata(field.fieldName, $event)"
						/>
					</UFormField>
				</div>
			</SharedLayoutSectionUCard>
			<SharedFormActions submit-text="Start Session">
				<template #cancel>
					<SharedButtonActionButton type="button" text="Cancel" action="cancel" @click="emit('cancel')" />
				</template>
				<SharedButtonActionButton type="submit" text="Start Session" leading-icon="i-lucide-plus" action="positive" :loading="isSaving" />
			</SharedFormActions>
		</SharedFormShell>
	</div>
</template>

<script setup lang="ts">
import { intakeSessionSchema, intakeSessionFormFields, type IntakeSessionForm } from "#shared/utils/formSchemas"

type Source = { sourceID: string; sourceName: string }
type SourceField = { fieldID: string; fieldName: string; type: "TEXT" | "NUMBER" | "DATE" | "BOOLEAN" | "CHOICE"; choices: unknown; optional: boolean }

const props = defineProps<{ sources: Source[] }>()
const emit = defineEmits<{ cancel: []; started: [inventoryIntakeSessionID: string] }>()
const { state, validate, onError } = createFormBuilder(intakeSessionSchema, () => ({
	sourceID: "",
	inventoryIntakeSessionName: "",
	intakeDate: new Date().toISOString().slice(0, 10),
	notes: "",
}))
const textMetadata = reactive<Record<string, string>>({})
const booleanMetadata = reactive<Record<string, boolean>>({})
const isSaving = ref(false)
const { data: sessionFields } = await useFetch<SourceField[]>("/api/volunteer/inventory/source/field", {
	query: computed(() => ({ sourceID: state.value.sourceID })),
})
const sourceFields = computed<SourceField[]>(() => sessionFields.value ?? [])

const choiceItems = (field: SourceField) => (Array.isArray(field.choices) ? field.choices.filter((choice): choice is string => typeof choice === "string") : [])
const textMetadataValue = (fieldName: string): string => textMetadata[fieldName] ?? ""
const setTextMetadata = (fieldName: string, value: unknown) => {
	textMetadata[fieldName] = typeof value === "string" || typeof value === "number" ? value.toString() : ""
}

const startSession = async (event: { data: IntakeSessionForm }) => {
	isSaving.value = true
	try {
		const session = await $fetch<{ inventoryIntakeSessionID: string }>("/api/volunteer/inventory/inventory-intake-session", {
			method: "POST",
			body: {
				...event.data,
				intakeDate: new Date(`${event.data.intakeDate}T00:00:00`).toISOString(),
				sourceMetadata: { ...textMetadata, ...booleanMetadata },
			},
		})
		emit("started", session.inventoryIntakeSessionID)
	} finally {
		isSaving.value = false
	}
}
</script>
