<template>
	<UForm ref="formRef" :schema="schema" :state="bagDetails">
		<div class="flex justify-center">
			<div class="flex w-full max-w-100 flex-col gap-4">
				<UCard>
					<UFormField label="Select Labels" class="text-xl">
						<UCheckboxGroup v-model="bagDetails.selectedCategory" size="xl" class="mt-2" :items="labels" />
					</UFormField>
				</UCard>
				<UCard>
					<UFormField name="expirationDate" label="Expiration Date" class="text-xl" :ui="{ error: 'text-sm' }" required>
						<UInputDate ref="inputDate" v-model="bagDetails.expirationDate" class="mt-2">
							<template #leading>
								<UPopover :reference="inputDate?.inputsRef[3]?.$el">
									<SharedButtonActionButton
										color="neutral"
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
				</UCard>
				<UCard v-if="permissionsStore.canAdminAccess">
					<UFormField label="Privacy" class="text-xl">
						<UCheckbox v-model="bagDetails.isPrivate" label="Make this bag private" class="mt-2" />
						<UTextarea
							v-if="bagDetails.isPrivate"
							v-model="bagDetails.bagDescription"
							placeholder="Please enter a bag description..."
							class="mt-2 w-full"
							:rows="4"
						/>
					</UFormField>
				</UCard>
			</div>
		</div>
	</UForm>
</template>

<script lang="ts" setup>
import { emergencyBagDetailsSchema } from "~/utils/formSchemas"
import { getLocalTimeZone, today } from "@internationalized/date"

const permissionsStore = usePermissionsStore()
const bagDetails = defineModel<{
	selectedCategory: string[]
	expirationDate: Date
	isPrivate: boolean
	bagDescription: string
}>("bagDetails", { required: true })
const inputDate = useTemplateRef("inputDate")
const formRef = useTemplateRef("formRef")

const schema = emergencyBagDetailsSchema

const labels = [
	{ label: "Vegetarian", value: "Vegetarian" },
	{ label: "Peanut Butter", value: "Peanut Butter" },
]

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
