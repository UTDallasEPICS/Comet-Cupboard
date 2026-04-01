<template>
    <UContainer class="py-8">
        <header>
            <SharedTextPageTitle>Emergency Bag</SharedTextPageTitle>
        </header>

        <section class="mt-4">
            <UCard>
                <template #header>
                    <SharedTextSectionTitle>Claim Bag</SharedTextSectionTitle>
                </template>

                <div class="space-y-4">
                    <UInput
                        v-model="bagID"
                        placeholder="Bag ID"
                        :disabled="isLoading"
                    />

                    <SharedTextBase v-if="errorMessage" class="text-red-500">
                        {{ errorMessage }}
                    </SharedTextBase>

                    <SharedTextBase v-if="successMessage" class="text-green-500">
                        {{ successMessage }}
                    </SharedTextBase>

                    <div class="flex justify-end">
                        <SharedButtonPositiveAction
                            text="Submit"
                            :disabled="isLoading"
                            @click="submitBagID"
                        />
                    </div>
                </div>
            </UCard>
        </section>
    </UContainer>
</template>

<script lang="ts" setup>
const bagID = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const submitBagID = async () => {
    errorMessage.value = ''
    successMessage.value = ''

    if (bagID.value.length !== 5) {
        errorMessage.value = "Please enter a valid 5-character Bag ID."
        return
    }

    isLoading.value = true

    try {
        const response = await $fetch('/api/public/emergency-bag/bagtaken', {
            method: 'POST',
            body: { label: bagID.value }
        })

        successMessage.value = response.message || "Bag claimed successfully!"
        bagID.value = ''

    } catch (error: any) {
        console.error("Error details:", error.data)
        errorMessage.value = error.data?.statusMessage || "Failed to submit Bag ID. Please try again."
    } finally {
        isLoading.value = false
    }
}
</script>