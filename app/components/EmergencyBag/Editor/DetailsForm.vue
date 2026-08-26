<template>
	<SharedFormShell ref="formRef" :validate="validate" :state="bagDetails" :on-error="onError">
		<div class="flex justify-center">
			<div class="flex w-full max-w-100 flex-col gap-4">
				<SharedFormCard>
					<UFormField name="labels" v-bind="emergencyBagDetailsFormFields.labels" class="text-xl">
						<UCheckboxGroup v-model="bagDetails.labels" size="xl" class="mt-2" :items="labelOptions" />
					</UFormField>
				</SharedFormCard>
				<SharedFormCard>
					<UFormField name="expirationDate" v-bind="emergencyBagDetailsFormFields.expirationDate" class="text-xl" :ui="{ error: 'text-sm' }" required>
						<UInputDate ref="inputDate" v-model="bagDetails.expirationDate" class="mt-2">
							<template #leading>
								<UPopover :reference="inputDate?.inputsRef[3]?.$el">
									<SharedButtonActionButton
										action="neutral"
										variant="link"
										size="md"
										icon="i-lucide-calendar"
										aria-label="Select a date"
										class="px-0"
									/>

									<template #content>
										<UCalendar v-model="bagDetails.expirationDate" class="p-2" />
									</template>
								</UPopover>
							</template>
						</UInputDate>
					</UFormField>
				</SharedFormCard>
				<SharedFormCard v-if="permissionsStore.canAdminAccess">
					<UFormField name="private" v-bind="emergencyBagDetailsFormFields.private" class="text-xl">
						<UCheckbox v-model="bagDetails.private" label="Make this bag private" class="mt-2" />
						<UTextarea
							v-if="bagDetails.private"
							v-model="bagDetails.bagDescription"
							:placeholder="emergencyBagDetailsFormFields.bagDescription.placeholder"
							class="mt-2 w-full"
							:rows="4"
						/>
					</UFormField>
				</SharedFormCard>
			</div>
		</div>
	</SharedFormShell>
</template>

<script lang="ts" setup>
import { emergencyBagDetailsSchema, emergencyBagDetailsFormFields, type EmergencyBagDetailsForm } from "#shared/utils/formSchemas"
import type { DateValue } from "@internationalized/date"

const permissionsStore = usePermissionsStore()
const bagDetails = defineModel<EmergencyBagDetailsForm & { expirationDate: DateValue | null }>("bagDetails", { required: true })
const inputDate = useTemplateRef("inputDate")
const formRef = useTemplateRef("formRef")

const schema = emergencyBagDetailsSchema
const { validate, onError } = createFormBuilder(schema)

const { data: emergencyBagLabels } = useFetch<{ emergencyBagLabelName: string }[]>("/api/public/emergency-bag/label")
const labelOptions = computed(() => (emergencyBagLabels.value ?? []).map((label) => ({ label: label.emergencyBagLabelName, value: label.emergencyBagLabelName })))

watch(
	() => bagDetails.value.expirationDate,
	async () => {
		await formRef.value?.validate({
			name: "expirationDate",
		})
	}
)

defineExpose({
	validate: async () => {
		const result = await formRef.value?.validate({ silent: false })
		return result !== false && formRef.value?.errors.length === 0
	},
})
</script>
