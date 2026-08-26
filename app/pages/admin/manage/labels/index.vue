<template>
	<div>
		<NuxtLayout name="main" title="Manage Labels" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }">
			<USeparator class="my-4" />
			<section class="space-y-4">
				<SharedLayoutSectionUCard title="Active Labels">
					<div class="flex items-center justify-between gap-4">
						<SharedTextSectionTitle>Specific Item Labels</SharedTextSectionTitle>
						<SharedButtonActionButton icon="i-lucide-plus" action="positive" aria-label="Add specific item label" @click="openCreate('item')" />
					</div>
					<USeparator class="my-4" />
					<SharedLayoutGrid v-if="activeItemLabels.length">
						<li v-for="label in activeItemLabels" :key="label.itemLabelID">
							<DomainCardManageItemLabelCard
								:item-label-name="label.itemLabelName"
								:archived="label.archived"
								@edit="openEdit({ type: 'item', label })"
							/>
						</li>
					</SharedLayoutGrid>
					<SharedTextBaseSecondary v-else class="block text-center">No active specific item labels found</SharedTextBaseSecondary>

					<div class="mt-6 flex items-center justify-between gap-4">
						<SharedTextSectionTitle>Emergency Bag Labels</SharedTextSectionTitle>
						<SharedButtonActionButton icon="i-lucide-plus" action="positive" aria-label="Add emergency bag label" @click="openCreate('emergency')" />
					</div>
					<USeparator class="my-4" />
					<SharedLayoutGrid v-if="activeEmergencyBagLabels.length">
						<li v-for="label in activeEmergencyBagLabels" :key="label.emergencyBagLabelID">
							<DomainCardManageEmergencyBagLabelCard
								:emergency-bag-label-name="label.emergencyBagLabelName"
								:archived="label.archived"
								@edit="openEdit({ type: 'emergency', label })"
							/>
						</li>
					</SharedLayoutGrid>
					<SharedTextBaseSecondary v-else class="block text-center">No active emergency bag labels found</SharedTextBaseSecondary>
				</SharedLayoutSectionUCard>

				<SharedLayoutSectionUCard title="Archived Labels">
					<SharedTextSectionTitle>Specific Item Labels</SharedTextSectionTitle>
					<USeparator class="my-4" />
					<SharedLayoutGrid v-if="archivedItemLabels.length">
						<li v-for="label in archivedItemLabels" :key="label.itemLabelID">
							<DomainCardManageItemLabelCard
								:item-label-name="label.itemLabelName"
								:archived="label.archived"
								@edit="openEdit({ type: 'item', label })"
							/>
						</li>
					</SharedLayoutGrid>
					<SharedTextBaseSecondary v-else class="block text-center">No archived specific item labels found</SharedTextBaseSecondary>

					<SharedTextSectionTitle class="mt-6">Emergency Bag Labels</SharedTextSectionTitle>
					<USeparator class="my-4" />
					<SharedLayoutGrid v-if="archivedEmergencyBagLabels.length">
						<li v-for="label in archivedEmergencyBagLabels" :key="label.emergencyBagLabelID">
							<DomainCardManageEmergencyBagLabelCard
								:emergency-bag-label-name="label.emergencyBagLabelName"
								:archived="label.archived"
								@edit="openEdit({ type: 'emergency', label })"
							/>
						</li>
					</SharedLayoutGrid>
					<SharedTextBaseSecondary v-else class="block text-center">No archived emergency bag labels found</SharedTextBaseSecondary>
				</SharedLayoutSectionUCard>
			</section>
		</NuxtLayout>

		<UModal v-model:open="isEditorOpen" :title="editorTitle">
			<template #content>
				<UCard class="w-full max-w-md">
					<SharedTextCardTitle>{{ editorTitle }}</SharedTextCardTitle>
					<USeparator class="my-4" />
					<ManageLabelEditorItemLabelForm
						v-if="editingLabel?.type === 'item'"
						:initial-values="itemLabelInitialValues"
						:submit-text="editingLabel.label ? 'Save Label' : 'Create Label'"
						@submit="saveItemLabel"
					/>
					<ManageLabelEditorEmergencyBagLabelForm
						v-else-if="editingLabel?.type === 'emergency'"
						:initial-values="emergencyBagLabelInitialValues"
						:submit-text="editingLabel.label ? 'Save Label' : 'Create Label'"
						@submit="saveEmergencyBagLabel"
					/>
				</UCard>
			</template>
		</UModal>
	</div>
</template>

<script setup lang="ts">
import type { EmergencyBagLabelForm, ItemLabelForm } from "#shared/utils/formSchemas"

definePageMeta({ layout: false })

interface ItemLabel {
	itemLabelID: string
	itemLabelName: string
	archived: boolean
}

interface EmergencyBagLabel {
	emergencyBagLabelID: string
	emergencyBagLabelName: string
	archived: boolean
}

type EditingLabel = { type: "item"; label?: ItemLabel } | { type: "emergency"; label?: EmergencyBagLabel }

const toast = useToast()
const isEditorOpen = ref(false)
const editingLabel = ref<EditingLabel | null>(null)

const { data: itemLabels, refresh: refreshItemLabels } = await useFetch<ItemLabel[]>("/api/admin/inventory/item-label", {
	query: { includeArchived: "true" },
})
const { data: emergencyBagLabels, refresh: refreshEmergencyBagLabels } = await useFetch<EmergencyBagLabel[]>("/api/admin/emergency-bag/label", {
	query: { includeArchived: "true" },
})

const activeItemLabels = computed(() => (itemLabels.value ?? []).filter((label) => !label.archived))
const archivedItemLabels = computed(() => (itemLabels.value ?? []).filter((label) => label.archived))
const activeEmergencyBagLabels = computed(() => (emergencyBagLabels.value ?? []).filter((label) => !label.archived))
const archivedEmergencyBagLabels = computed(() => (emergencyBagLabels.value ?? []).filter((label) => label.archived))

const itemLabelInitialValues = computed<ItemLabelForm>(() => ({
	itemLabelName: editingLabel.value?.type === "item" ? (editingLabel.value.label?.itemLabelName ?? "") : "",
	archived: editingLabel.value?.type === "item" ? (editingLabel.value.label?.archived ?? false) : false,
}))
const emergencyBagLabelInitialValues = computed<EmergencyBagLabelForm>(() => ({
	emergencyBagLabelName: editingLabel.value?.type === "emergency" ? (editingLabel.value.label?.emergencyBagLabelName ?? "") : "",
	archived: editingLabel.value?.type === "emergency" ? (editingLabel.value.label?.archived ?? false) : false,
}))
const editorTitle = computed(() => {
	if (editingLabel.value?.type === "item") return editingLabel.value.label ? "Edit Specific Item Label" : "Add Specific Item Label"
	if (editingLabel.value?.type === "emergency") return editingLabel.value.label ? "Edit Emergency Bag Label" : "Add Emergency Bag Label"
	return "Manage Label"
})

const openCreate = (type: EditingLabel["type"]) => {
	editingLabel.value = { type }
	isEditorOpen.value = true
}
const openEdit = (label: EditingLabel) => {
	editingLabel.value = label
	isEditorOpen.value = true
}

const handleSave = async (request: Promise<unknown>) => {
	try {
		await request
		isEditorOpen.value = false
		await Promise.all([refreshItemLabels(), refreshEmergencyBagLabels()])
	} catch {
		toast.add({ title: "Unable to save label", color: "error" })
	}
}

const saveItemLabel = async (payload: ItemLabelForm) => {
	const itemLabelID = editingLabel.value?.type === "item" ? editingLabel.value.label?.itemLabelID : undefined
	await handleSave($fetch("/api/admin/inventory/item-label", { method: "PUT", body: { ...payload, itemLabelID } }))
}
const saveEmergencyBagLabel = async (payload: EmergencyBagLabelForm) => {
	const emergencyBagLabelID = editingLabel.value?.type === "emergency" ? editingLabel.value.label?.emergencyBagLabelID : undefined
	await handleSave($fetch("/api/admin/emergency-bag/label", { method: "PUT", body: { ...payload, emergencyBagLabelID } }))
}
</script>