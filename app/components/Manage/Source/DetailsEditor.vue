<template>
	<SharedFormShell :validate="validate" :state="state" class="w-full" :on-submit="onSubmit" :on-error="onError">
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
				<SharedButtonActionButton type="button" label="Cancel" color="neutral" variant="outline" @click="cancelChanges" />
				<SharedButtonActionButton type="submit" label="Save Changes" color="secondary" :loading="saving" />
			</div>
		</SharedLayoutSectionUCard>
	</SharedFormShell>
</template>

<script setup lang="ts">
import { sourceDetailsSchema, type SourceDetailsForm } from "~/utils/formSchemas"

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
