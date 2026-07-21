<template>
	<UForm ref="formRef" :schema="schema" :state="bagDetails">
		<div class="flex justify-center">
			<div class="flex w-full max-w-100 flex-col gap-4">
				<UCard>
					<header class="mb-4 text-xl font-bold">Select Labels</header>

					<UCheckboxGroup v-model="bagDetails.selectedCategory" size="xl" :items="labels" />
				</UCard>
				<UCard>
					<header class="mb-4 text-xl font-bold">Expiration Date <span class="text-red-500">*</span></header>

					<UFormField name="expirationDate">
						<UInputDate ref="inputDate" v-model="bagDetails.expirationDate" class="">
							<template #leading>
								<UPopover :reference="inputDate?.inputsRef[3]?.$el">
									<UButton color="neutral" variant="link" size="md" icon="i-lucide-calendar" aria-label="Select a date" class="px-0" />

									<template #content>
										<UCalendar v-model="bagDetails.expirationDate" class="p-2" />
									</template>
								</UPopover>
							</template>
						</UInputDate>
					</UFormField>
				</UCard>
				<UCard v-if="permissionsStore.canAdminAccess">
					<header class="mb-4 text-xl font-bold">Privacy</header>

					<UCheckbox v-model="bagDetails.isPrivate" label="Make this bag private" />
					<UTextarea
						v-model="bagDetails.bagDescription"
						:disabled="!bagDetails.isPrivate"
						placeholder="Please enter a bag description..."
						class="mt-2 w-full"
						:rows="4"
					/>
				</UCard>
			</div>
		</div>
	</UForm>
</template>

<script lang="ts" setup>
import z from "zod"

const permissionsStore = usePermissionsStore()
const bagDetails = defineModel<{
	selectedCategory: string[]
	expirationDate: Date
	isPrivate: false
	bagDescription: string
}>("bagDetails", { required: true })
const inputDate = useTemplateRef("inputDate")
const formRef = useTemplateRef("formRef")

const schema = z.object({
	expirationDate: z.any().refine((val) => val !== null && val !== undefined, {
		message: "Please select an expiration date",
	}),
})

const labels = [
	{ label: "Vegetarian", value: "VEGETARIAN" },
	{ label: "Peanut Butter", value: "PEANUT_BUTTER" },
]

watch(
	() => bagDetails.value.expirationDate,
	(newVal) => {
		if (newVal) {
			formRef.value?.clear("expirationDate")
		}
	}
)

defineExpose({
	validate: async () => {
		const result = await formRef.value?.validate({ silent: false })
		return result !== false && formRef.value?.errors.length === 0
	},
})
</script>
