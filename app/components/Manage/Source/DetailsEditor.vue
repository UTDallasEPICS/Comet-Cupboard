<template>
	<UForm :validate="validate" :state="state" class="w-full" @submit="onSubmit" @error="onError">
		<SharedLayoutSectionUCard title="Source Details">
			<div class="space-y-4">
				<UFormField id="sourceName" name="sourceName" label="Source Name" description="Use up to 20 letters and spaces" required>
					<UInput v-model="state.sourceName" placeholder="Enter source name" class="w-full" />
				</UFormField>
				<UFormField id="archived" name="archived" label="Archived" description="Hide this source from active intake options">
					<UCheckbox v-model="state.archived" label="Archived" />
				</UFormField>
			</div>
			<div v-if="changesMade" class="mt-4 flex justify-end gap-2">
				<UButton type="button" label="Cancel" color="neutral" variant="outline" @click="cancelChanges" />
				<UButton type="submit" label="Save Changes" color="secondary" :loading="isSaving" />
			</div>
		</SharedLayoutSectionUCard>
	</UForm>
</template>

<script setup lang="ts">
import * as z from "zod"

const props = defineProps<{
	sourceID: string
	originalName: string
	originalArchived: boolean
}>()
const emit = defineEmits<{ updated: [] }>()
const formSchema = z.object({
	sourceName: z
		.string()
		.min(1, "Source name is required")
		.max(20, "Source name must be at most 20 characters")
		.regex(/^[A-Za-z ]+$/, "Source name must only contain letters and spaces"),
	archived: z.boolean(),
})
const { state, validate, onError } = createFormBuilder(formSchema, () => ({ sourceName: props.originalName, archived: props.originalArchived }))
const isSaving = ref(false)
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
const onSubmit = async (event: { data: z.infer<typeof formSchema> }) => {
	isSaving.value = true
	try {
		await $fetch("/api/admin/inventory/source", { method: "PUT", body: { sourceID: props.sourceID, ...event.data } })
		emit("updated")
	} finally {
		isSaving.value = false
	}
}
</script>
