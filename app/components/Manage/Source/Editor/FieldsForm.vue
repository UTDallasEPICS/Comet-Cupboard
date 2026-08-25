<template>
	<SharedFormCard>
		<div class="flex items-center justify-between gap-3">
			<SharedTextCardTitle>Source Fields</SharedTextCardTitle>
			<SharedButtonActionButton text="Add Field" leading-icon="i-lucide-plus" action="positive" @click="addField" />
		</div>
		<USeparator class="my-4" />
		<div v-if="editableFields.length" class="space-y-4">
			<SharedFormShell
				v-for="field in editableFields"
				:key="field.key"
				:validate="validateField"
				:state="field"
				:on-submit="saveField(field)"
				:on-error="onError"
			>
				<div class="border-border-soft space-y-3 rounded-lg border p-3">
					<UFormField :id="`${sourceFieldFormFields.fieldName.id}-${field.key}`" name="fieldName" v-bind="sourceFieldFormFields.fieldName" required
						><UInput v-model="field.fieldName" :placeholder="sourceFieldFormFields.fieldName.placeholder" class="w-full"
					/></UFormField>
					<UFormField :id="`${sourceFieldFormFields.type.id}-${field.key}`" name="type" v-bind="sourceFieldFormFields.type" required
						><USelect v-model="field.type" :items="fieldTypes" class="w-full"
					/></UFormField>
					<UCheckbox v-model="field.optional" label="Optional field" />
					<div v-if="field.type === 'CHOICE'" class="space-y-2 rounded-lg border p-3">
						<div class="flex items-center justify-between gap-2">
							<SharedTextBaseSecondary>Choice Values</SharedTextBaseSecondary>
							<SharedButtonActionButton
								type="button"
								text="Add Choice"
								leading-icon="i-lucide-plus"
								action="neutral"
								variant="outline"
								@click="field.choices.push('')"
							/>
						</div>
						<UFormField v-for="(_choice, index) in field.choices" :key="index" :name="`choices.${index}`" v-bind="sourceFieldFormFields.choices">
							<div class="flex items-center gap-2">
								<UInput v-model="field.choices[index]" :placeholder="sourceFieldFormFields.choices.placeholder" class="grow" />
								<SharedButtonActionButton
									type="button"
									icon="i-lucide-trash-2"
									action="negative"
									variant="ghost"
									aria-label="Delete choice"
									@click="field.choices.splice(index, 1)"
								/>
							</div>
						</UFormField>
					</div>
					<div v-if="fieldChanged(field) || field.isNew" class="flex justify-end gap-2">
						<SharedButtonActionButton type="button" text="Cancel" action="cancel" variant="outline" @click="cancelField(field)" />
						<SharedButtonActionButton
							type="submit"
							text="Save Changes"
							leading-icon="i-lucide-check"
							action="positive"
							:loading="savingFieldKey === field.key"
						/>
					</div>
					<SharedConfirmationModal v-else title="Confirm Field Removal?" confirm-text="Confirm Removal" @confirm="confirmRemoveField(field.fieldID)">
						<SharedButtonActionButton type="button" text="Remove" leading-icon="i-lucide-trash-2" action="negative" variant="outline" />
					</SharedConfirmationModal>
				</div>
			</SharedFormShell>
		</div>
		<SharedTextBaseSecondary v-else>No fields added yet.</SharedTextBaseSecondary>
	</SharedFormCard>
</template>

<script setup lang="ts">
import type { FormError } from "@nuxt/ui"
import { sourceFieldSchema, sourceFieldFormFields } from "#shared/utils/formSchemas"

type FieldType = "TEXT" | "NUMBER" | "DATE" | "BOOLEAN" | "CHOICE"
interface SourceField {
	fieldID: string
	fieldName: string
	type: FieldType
	optional: boolean
	choices: Record<string, string> | null
}
interface EditableField {
	key: string
	fieldID: string
	fieldName: string
	type: FieldType
	optional: boolean
	choices: string[]
	isNew: boolean
	original?: Omit<EditableField, "original">
}

const props = defineProps<{ sourceID: string; refreshToken?: number }>()
const emit = defineEmits<{
	save: [payload: { fieldID?: string; body: { sourceID?: string; fieldName: string; type: FieldType; optional: boolean; choices?: string[] } }]
	remove: [fieldID: string]
}>()
const fieldTypes = [
	{ label: "Text", value: "TEXT" },
	{ label: "Number", value: "NUMBER" },
	{ label: "Date", value: "DATE" },
	{ label: "TRUE/FALSE", value: "BOOLEAN" },
	{ label: "Choice", value: "CHOICE" },
]
const { onError } = createFormBuilder(sourceFieldSchema)
const { data: fields, refresh: refreshFields } = await useFetch<SourceField[]>("/api/volunteer/inventory/source/field", { query: { sourceID: props.sourceID } })
const editableFields = ref<EditableField[]>([])
const savingFieldKey = ref<string | null>(null)

const toEditable = (field: SourceField): EditableField => {
	const editable = {
		key: field.fieldID,
		fieldID: field.fieldID,
		fieldName: field.fieldName,
		type: field.type,
		optional: field.optional,
		choices: Object.values(field.choices ?? {}),
		isNew: false,
	}
	return { ...editable, original: { ...editable, choices: [...editable.choices] } }
}
watch(
	fields,
	(sourceFields) => {
		const newFields = editableFields.value.filter((field) => field.isNew)
		editableFields.value = [...(sourceFields ?? []).map(toEditable), ...newFields]
	},
	{ immediate: true }
)
watch(
	() => props.refreshToken,
	() => void refreshFields()
)
const validateField = async (field: EditableField): Promise<FormError[]> => {
	const result = sourceFieldSchema.safeParse(field)
	return result.success ? [] : result.error.issues.map((issue) => ({ name: String(issue.path[0]), message: issue.message }))
}
const fieldChanged = (field: EditableField) =>
	!field.original ||
	JSON.stringify({ fieldName: field.fieldName, type: field.type, optional: field.optional, choices: field.choices }) !==
		JSON.stringify({ fieldName: field.original.fieldName, type: field.original.type, optional: field.original.optional, choices: field.original.choices })
const addField = () => {
	const key = crypto.randomUUID()
	editableFields.value.push({
		key,
		fieldID: "",
		fieldName: `Field ${Math.floor(Math.random() * 9_000 + 1_000)}`,
		type: "TEXT",
		optional: false,
		choices: [],
		isNew: true,
	})
}
const cancelField = (field: EditableField) => {
	if (field.isNew) {
		editableFields.value = editableFields.value.filter((candidate) => candidate.key !== field.key)
		return
	}
	Object.assign(field, field.original, { choices: [...(field.original?.choices ?? [])] })
}
const saveField = (field: EditableField) => {
	const body = {
		fieldName: field.fieldName.trim(),
		type: field.type,
		optional: field.optional,
		choices: field.type === "CHOICE" ? field.choices.map((choice) => choice.trim()) : undefined,
	}
	if (field.isNew) editableFields.value = editableFields.value.filter((candidate) => candidate.key !== field.key)
	emit("save", field.isNew ? { body: { sourceID: props.sourceID, ...body } } : { fieldID: field.fieldID, body })
}
const confirmRemoveField = (fieldID: string) => {
	emit("remove", fieldID)
}
</script>
