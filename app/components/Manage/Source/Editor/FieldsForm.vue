<template>
	<UCard>
		<div class="flex items-center justify-between gap-3">
			<SharedTextCardTitle>Source Fields</SharedTextCardTitle>
			<SharedButtonActionButton label="Add Field" icon="i-lucide-plus" color="secondary" @click="addField" />
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
					<UFormField :id="`fieldName-${field.key}`" name="fieldName" label="Field Name" required
						><UInput v-model="field.fieldName" class="w-full"
					/></UFormField>
					<UFormField :id="`fieldType-${field.key}`" name="type" label="Field Type" required
						><USelect v-model="field.type" :items="fieldTypes" class="w-full"
					/></UFormField>
					<UCheckbox v-model="field.optional" label="Optional field" />
					<div v-if="field.type === 'CHOICE'" class="space-y-2 rounded-lg border p-3">
						<div class="flex items-center justify-between gap-2">
							<SharedTextBaseSecondary>Choice Values</SharedTextBaseSecondary>
							<SharedButtonActionButton
								type="button"
								label="Add Choice"
								icon="i-lucide-plus"
								color="neutral"
								variant="outline"
								@click="field.choices.push('')"
							/>
						</div>
						<UFormField v-for="(_choice, index) in field.choices" :key="index" :name="`choices.${index}`">
							<div class="flex items-center gap-2">
								<UInput v-model="field.choices[index]" placeholder="Choice value" class="grow" />
								<SharedButtonActionButton
									type="button"
									icon="i-lucide-trash-2"
									color="error"
									variant="ghost"
									aria-label="Delete choice"
									@click="field.choices.splice(index, 1)"
								/>
							</div>
						</UFormField>
					</div>
					<div v-if="fieldChanged(field) || field.isNew" class="flex justify-end gap-2">
						<SharedButtonActionButton type="button" label="Cancel" color="neutral" variant="outline" @click="cancelField(field)" />
						<SharedButtonActionButton type="submit" label="Save Changes" color="secondary" :loading="savingFieldKey === field.key" />
					</div>
					<SharedButtonActionButton
						v-else
						type="button"
						label="Remove"
						color="error"
						variant="outline"
						@click="openRemoveFieldModal(field.fieldID)"
					/>
				</div>
			</SharedFormShell>
		</div>
		<SharedTextBaseSecondary v-else>No fields added yet.</SharedTextBaseSecondary>
	</UCard>

	<UModal v-model:open="isRemoveFieldModalOpen">
		<template #content>
			<UCard>
				<SharedTextCardTitle>Confirm Field Removal?</SharedTextCardTitle>
				<USeparator class="my-2" />
				<div class="mt-4 flex justify-center gap-2">
					<SharedButtonActionButton label="Cancel" color="neutral" variant="outline" @click="isRemoveFieldModalOpen = false" />
					<SharedButtonActionButton label="Confirm Removal" color="error" @click="confirmRemoveField" />
				</div>
			</UCard>
		</template>
	</UModal>
</template>

<script setup lang="ts">
import type { FormError } from "@nuxt/ui"
import { sourceFieldSchema } from "~/utils/formSchemas"

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
const isRemoveFieldModalOpen = ref(false)
const fieldIDToRemove = ref<string | null>(null)

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
const openRemoveFieldModal = (fieldID: string) => {
	fieldIDToRemove.value = fieldID
	isRemoveFieldModalOpen.value = true
}
const confirmRemoveField = () => {
	if (!fieldIDToRemove.value) return
	emit("remove", fieldIDToRemove.value)
	fieldIDToRemove.value = null
	isRemoveFieldModalOpen.value = false
}
</script>
