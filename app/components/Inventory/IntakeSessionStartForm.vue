<template>
	<div class="space-y-4">
		<div class="flex items-center justify-between gap-3">
			<SharedTextCardTitle>Start Intake Session</SharedTextCardTitle>
			<UButton :icon="icons.back" color="neutral" variant="ghost" aria-label="Back to intake sessions" @click="emit('cancel')" />
		</div>
		<UForm :state="state" :validate="validate" class="space-y-4" @submit="startSession">
			<SharedLayoutSectionUCard title="Session Details">
				<div class="space-y-4">
					<UFormField label="Session Name" name="inventoryIntakeSessionName" required
						><UInput v-model="state.inventoryIntakeSessionName" placeholder="Enter session name" class="w-full"
					/></UFormField>
					<UFormField label="Intake Date" name="intakeDate" required><UInput v-model="state.intakeDate" type="date" class="w-full" /></UFormField>
					<UFormField label="Notes" name="notes"><UTextarea v-model="state.notes" placeholder="Optional notes" class="w-full" /></UFormField>
				</div>
			</SharedLayoutSectionUCard>
			<SharedLayoutSectionUCard title="Source Information">
				<div class="space-y-4">
					<UFormField label="Source" name="sourceID" required
						><USelect
							v-model="state.sourceID"
							:items="sources"
							value-key="sourceID"
							label-key="sourceName"
							placeholder="Select source"
							class="w-full"
					/></UFormField>
					<UFormField v-for="field in sourceFields" :key="field.fieldID" :label="field.fieldName" :required="!field.optional">
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
			<div class="flex justify-end gap-2">
				<UButton type="button" label="Cancel" color="neutral" variant="outline" @click="emit('cancel')" />
				<UButton type="submit" label="Start Session" color="secondary" :loading="isSaving" />
			</div>
		</UForm>
	</div>
</template>

<script setup lang="ts">
import * as z from "zod"

type Source = { sourceID: string; sourceName: string }
type SourceField = { fieldID: string; fieldName: string; type: "TEXT" | "NUMBER" | "DATE" | "BOOLEAN" | "CHOICE"; choices: unknown; optional: boolean }

const props = defineProps<{ sources: Source[] }>()
const emit = defineEmits<{ cancel: []; started: [inventoryIntakeSessionID: string] }>()
const formSchema = z.object({
	sourceID: z.string().min(1, "Source is required"),
	inventoryIntakeSessionName: z.string().min(1, "Session name is required"),
	intakeDate: z.string().min(1, "Intake date is required"),
	notes: z.string(),
})
const { state, validate } = createFormBuilder(formSchema, () => ({
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

const startSession = async (event: { data: z.infer<typeof formSchema> }) => {
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
