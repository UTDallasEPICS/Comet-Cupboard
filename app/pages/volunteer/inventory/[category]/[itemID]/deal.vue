<template>
	<UContainer class="py-8">
		<header>
			<SharedButtonNavigateBack :text="'Back to ' + currentCategory" :to="{ path: `/volunteer/inventory/${currentCategory}` }" />
			<SharedTextPageTitle>{{ currentCategory }}</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<SharedTextSectionTitle>Edit {{ item?.name }} Deal</SharedTextSectionTitle>
			<div class="mx-auto w-min">
				<img
					:src="`/api/public/image/${item?.imgName}`"
					:alt="item?.name"
					class="border-final-border-soft aspect-square h-full rounded-lg border object-cover"
				/>

				<URadioGroup v-model="selectedDealOption" class="mt-4" :items="dealOptions" />

				<UForm :validate="validate" :state="state" class="mt-4 w-96 space-y-4" @submit="onSubmit" @error="onError">
					<div v-if="selectedDealOption == 'Deal is X for Y'">
						<UFormField id="newDealActualCount" name="newDealActualCount" label="Actual Count" description="The number of items in the deal">
							<UInputNumber v-model="state.newDealActualCount" placeholder="Enter actual count" :min="1" :max="99" />
						</UFormField>
						<UFormField
							id="newDealAdjustedCount"
							name="newDealAdjustedCount"
							label="Adjusted Count"
							description="The number of items the actual count is being adjusted to in the deal"
						>
							<UInputNumber v-model="state.newDealAdjustedCount" placeholder="Enter adjusted count" :min="0" :max="99" />
						</UFormField>
					</div>

					<footer class="sticky right-4 bottom-8 mt-4 flex justify-end space-x-2 sm:ml-auto">
						<SharedButtonPositiveAction type="submit" text="Submit" />
					</footer>
				</UForm>
			</div>
		</section>
	</UContainer>
</template>

<script lang="ts" setup>
import * as z from "zod"
import type { FormError, FormErrorEvent, FormSubmitEvent } from "@nuxt/ui"

const route = useRoute()
const currentCategory = route.params.category as string
const itemID = route.params.itemID as string

const dealOptions = ref(["No deal", "Deal is X for Y", "Free deal"])
const selectedDealOption = ref("No deal")

type Schema = {
	newDealActualCount: number
	newDealAdjustedCount: number
}

const state = ref<Partial<Schema>>({
	newDealActualCount: 2,
	newDealAdjustedCount: 1,
})

const { data: item } = await useFetch(`/api/student/inventory/item`, {
	params: { itemID },
})

watchEffect(async () => {
	if (item.value) {
		if (item.value.Deal) {
			if (item.value.Deal.actualCount === 1 && item.value.Deal.adjustedCount === 0) {
				selectedDealOption.value = "Free deal"
			} else {
				selectedDealOption.value = "Deal is X for Y"
			}
			state.value.newDealActualCount = item.value.Deal.actualCount
			state.value.newDealAdjustedCount = item.value.Deal.adjustedCount
		} else {
			selectedDealOption.value = "No deal"
		}
	}
})

const schema = z.object({
	newDealActualCount: z.number().min(1, "Actual count must be at least 1"),
	newDealAdjustedCount: z
		.number()
		.min(0, "Adjusted count must be at least 0")
		.refine(
			(value) => {
				if (state.value.newDealActualCount !== undefined) {
					return value < state.value.newDealActualCount
				}
				return true
			},
			{ message: "Adjusted count must be less than actual count", path: ["newDealAdjustedCount"] }
		),
})

const validate = async (state: Partial<Schema>): Promise<FormError[]> => {
	const errors = []
	const result = await schema.safeParseAsync(state)
	if (!result.success) {
		errors.push(...result.error.issues.map((err) => ({ name: String(err.path[0]), message: err.message })))
	}
	return errors
}

const onError = async (event: FormErrorEvent) => {
	if (event?.errors?.[0]?.id) {
		const el = document.getElementById(event.errors[0].id)
		el?.focus()
		el?.scrollIntoView({ behavior: "smooth", block: "center" })
	}
}

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	try {
		if (selectedDealOption.value === "No deal") {
			if (item.value?.Deal) {
				await $fetch("/api/volunteer/inventory/deal", {
					method: "DELETE",
					body: { itemID: item.value?.itemID },
				})
			}
			return
		} else if (selectedDealOption.value === "Free deal") {
			await $fetch("/api/volunteer/inventory/deal", {
				method: "PUT",
				body: { itemID: item.value?.itemID, actualCount: 1, adjustedCount: 0 },
			})
			return
		} else {
			if (state.value.newDealAdjustedCount == 0) {
				await $fetch("/api/volunteer/inventory/deal", {
					method: "PUT",
					body: { itemID: item.value?.itemID, actualCount: 1, adjustedCount: 0 },
				})
			} else {
				await $fetch("/api/volunteer/inventory/deal", {
					method: "PUT",
					body: { itemID: item.value?.itemID, actualCount: event.data.newDealActualCount, adjustedCount: event.data.newDealAdjustedCount },
				})
			}
		}
	} catch (error) {
		// idk for now
	} finally {
		navigateTo(`/volunteer/inventory/${currentCategory}`)
	}
}
</script>
