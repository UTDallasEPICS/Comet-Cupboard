<template>
    <!-- Mobile: flex-col stack. Desktop (md+): 2-column grid -->
    <div class="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-2">

        <!-- Category -->
        <UCard>
            <template #header>
                <SharedTextCardTitle>Category</SharedTextCardTitle>
            </template>
            <URadioGroup
                :model-value="selectedCategory ?? undefined"
                size="md"
                variant="card"
                :items="categories"
                @update:model-value="emit('update:selectedCategory', $event)"
            />
        </UCard>

        <!-- Right column: Expiry + Privacy (admin) or Expiry + Button (volunteer) -->
        <div class="flex flex-col gap-2">
            <UCard class="flex-1">
                <template #header>
                    <SharedTextCardTitle>Expiry Date</SharedTextCardTitle>
                </template>
                <div class="flex items-center justify-center py-2">
                    <UInputDate
                        :model-value="expiryDate"
                        size="xl"
                        icon="i-lucide-calendar"
                        :min-value="minDate"
                        @update:model-value="$event && emit('update:expiryDate', $event as CalendarDate)"
                    />
                </div>
            </UCard>

            <UCard v-if="canAdminAccess">
                <template #header>
                    <SharedTextCardTitle>Privacy</SharedTextCardTitle>
                </template>
                <UCheckbox
                    :model-value="selectedPrivacy === 'private'"
                    label="Private"
                    @update:model-value="emit('update:selectedPrivacy', $event ? 'private' : null)"
                />
            </UCard>

            <!-- Volunteer confirm button fills the right column on desktop -->
            <UCard v-if="!canAdminAccess">
                <UButton
                    :label="isEditMode ? 'Update Bag' : 'Confirm Bag'"
                    block
                    variant="solid"
                    size="xl"
                    :ui="{ base: 'bg-final-utd-green font-bold py-5 text-xl' }"
                    @click="emit('submit')"
                />
            </UCard>
        </div>

        <!-- Admin confirm button spans full width -->
        <UCard v-if="canAdminAccess" class="md:col-span-2">
            <UButton
                :label="isEditMode ? 'Update Bag' : 'Confirm Bag'"
                block
                variant="solid"
                size="xl"
                :ui="{ base: 'bg-final-utd-green font-bold py-5 text-xl' }"
                @click="emit('submit')"
            />
        </UCard>

    </div>
</template>

<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'

defineProps<{
    selectedCategory: string | null
    selectedPrivacy: string | null
    expiryDate: CalendarDate
    minDate: CalendarDate
    canAdminAccess: boolean
    isEditMode: boolean
}>()

const emit = defineEmits<{
    'update:selectedCategory': [value: string | null]
    'update:selectedPrivacy': [value: string | null]
    'update:expiryDate': [value: CalendarDate]
    submit: []
}>()

const categories = [
    { label: 'Veg + PB', value: 'VEGETARIAN_AND_PEANUT_BUTTER' },
    { label: 'Veg + Non-PB', value: 'VEGETARIAN_AND_NON_PEANUT_BUTTER' },
    { label: 'Non-Veg + PB', value: 'NONVEGETARIAN_AND_PEANUT_BUTTER' },
    { label: 'Non-Veg + Non-PB', value: 'NONVEGETARIAN_AND_NON_PEANUT_BUTTER' }
]

</script>
