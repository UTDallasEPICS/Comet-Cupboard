<template>
	<div>
		<NuxtLayout name="main" title="Claim Emergency Bag">
			<USeparator class="my-4" />
			<SharedFormShell :validate="validate" :state="state" :on-submit="submit" :on-error="onError" width-class="w-full">
				<SharedLayoutSectionUCard title="Claim Bag">
					<div class="space-y-4">
						<UFormField name="label" v-bind="claimEmergencyBagFormFields.label" required>
							<UInput v-model="state.label" :placeholder="claimEmergencyBagFormFields.label.placeholder" :disabled="isLoading" class="w-full" />
						</UFormField>

						<UAlert v-if="errorMessage" color="error" variant="subtle" :description="errorMessage" />
						<UAlert v-if="successMessage" color="success" variant="subtle" :description="successMessage" />
					</div>
				</SharedLayoutSectionUCard>

				<SharedFormActions class-name="sticky right-4 bottom-8 mt-4">
					<SharedButtonActionButton action="positive" type="submit" text="Claim Bag" leading-icon="i-lucide-check" :loading="isLoading" />
				</SharedFormActions>
			</SharedFormShell>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
import {
	claimEmergencyBagFormFields,
	claimEmergencyBagSchema,
	type ClaimEmergencyBagForm,
} from "#shared/utils/formSchemas"

definePageMeta({ layout: false })

const isLoading = ref(false)
const errorMessage = ref("")
const successMessage = ref("")
const { state, validate, onError } = createFormBuilder(claimEmergencyBagSchema, () => ({ label: "" }))

const submit = async (event: { data: ClaimEmergencyBagForm }) => {
	errorMessage.value = ""
	successMessage.value = ""

	isLoading.value = true

	try {
		const response = await $fetch("/api/public/emergency-bag/take-bag", {
			method: "POST",
			body: event.data,
		})

		successMessage.value = response.message || "Bag claimed successfully!"
		state.value.label = ""
	} catch (error: unknown) {
		errorMessage.value = (error as { data?: { statusMessage?: string } }).data?.statusMessage ?? "Failed to claim Bag ID. Please try again."
	} finally {
		isLoading.value = false
	}
}
</script>
