<template>
	<div class="flex justify-center">
		<div class="flex w-full max-w-100 flex-col gap-4">
			<UCard>
				<template #header>
					<h2 class="text-xl font-bold">Category</h2>
				</template>
				<UCheckboxGroup v-model="bagDetails.selectedCategory" size="md" variant="card" :items="labels" />
			</UCard>
			<UCard>
				<template #header>
					<h2 class="text-xl font-bold">Expiration Date</h2>
				</template>
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
			</UCard>
			<UCard>
				<template #header>
					<h2 class="text-xl font-bold">Privacy</h2>
				</template>
				<URadioGroup v-model="bagDetails.selectedPrivacy" size="md" variant="card" :items="privacy" />
				<UTextarea
					v-if="bagDetails.selectedPrivacy === 'PRIVATE'"
					v-model="bagDetails.bagDescription"
					placeholder="Optional bag description"
					class="mt-2 w-full"
					:rows="4"
				/>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
const bagDetails = defineModel<{
	selectedCategory: string[]
	expirationDate: Date
	selectedPrivacy: string
	bagDescription: string
}>("bagDetails", { required: true })
const inputDate = useTemplateRef("inputDate")

const labels = [
	{ label: "Vegetarian", value: "VEGETARIAN", color: "#ADBC76" },
	{ label: "Peanut Butter", value: "PEANUT_BUTTER", color: "#F6D6A2" },
]

const privacy = [
	{ label: "Public", value: "PUBLIC" },
	{ label: "Private", value: "PRIVATE" },
]
</script>
