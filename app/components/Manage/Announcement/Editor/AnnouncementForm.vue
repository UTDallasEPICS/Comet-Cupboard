<template>
	<SharedFormShell :validate="validate" :state="state" :on-submit="submit" :on-error="onError" width-class="w-full" class="space-y-4">
		<SharedLayoutSectionUCard title="Announcement Details">
			<UFormField name="message" v-bind="announcementFormFields.message" required>
				<UTextarea v-model="state.message" class="w-full" :placeholder="announcementFormFields.message.placeholder" />
			</UFormField>
		</SharedLayoutSectionUCard>
		<SharedLayoutSectionUCard title="Schedule">
			<UFormField name="startsDate" v-bind="announcementFormFields.startsDate" class="text-xl" :ui="{ error: 'text-sm' }" required>
				<UInputDate v-model="state.startsDate">
					<template #leading>
						<UPopover>
							<SharedButtonActionButton
								color="neutral"
								variant="link"
								size="md"
								icon="i-lucide-calendar"
								aria-label="Select a date"
								class="px-0"
							/>
							<template #content><UCalendar v-model="state.startsDate" class="p-2" /></template>
						</UPopover>
					</template>
				</UInputDate>
			</UFormField>
			<UFormField name="startsTime" v-bind="announcementFormFields.startsTime" class="mt-2 text-xl" :ui="{ error: 'text-sm' }" required>
				<UInputTime v-model="state.startsTime" />
			</UFormField>
			<UFormField name="endsDate" v-bind="announcementFormFields.endsDate" class="mt-4 text-xl" :ui="{ error: 'text-sm' }" required>
				<UInputDate v-model="state.endsDate">
					<template #leading>
						<UPopover>
							<SharedButtonActionButton
								color="neutral"
								variant="link"
								size="md"
								icon="i-lucide-calendar"
								aria-label="Select a date"
								class="px-0"
							/>
							<template #content><UCalendar v-model="state.endsDate" class="p-2" /></template>
						</UPopover>
					</template>
				</UInputDate>
			</UFormField>
			<UFormField name="endsTime" v-bind="announcementFormFields.endsTime" class="mt-2 text-xl" :ui="{ error: 'text-sm' }" required>
				<UInputTime v-model="state.endsTime" />
			</UFormField>
		</SharedLayoutSectionUCard>
		<SharedFormActions :submit-text="submitText" class-name="sticky right-4 bottom-8 mt-4" />
	</SharedFormShell>
</template>

<script setup lang="ts">
import { announcementSchema, announcementFormFields, type AnnouncementForm } from "~/utils/formSchemas"

const props = withDefaults(defineProps<{ initialValues: AnnouncementForm; submitText?: string }>(), {
	submitText: "Submit",
})
const emit = defineEmits<{ submit: [payload: AnnouncementForm] }>()
const { state, validate, onError } = createFormBuilder(announcementSchema, () => props.initialValues)

watch(
	() => props.initialValues,
	(values) => Object.assign(state.value, values),
	{ deep: true }
)

const submit = (event: { data: AnnouncementForm }) => emit("submit", event.data)
</script>
