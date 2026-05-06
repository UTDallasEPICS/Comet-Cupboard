<template>
    <UCard>
        <template #header>
            <SharedTextCardTitle>Current Bag</SharedTextCardTitle>
        </template>
        <div class="overflow-y-auto h-54 space-y-3">
            <div v-if="bagItems.length === 0 && currentBagItems.length === 0" class="text-center py-4">
                <p class="text-final-text-soft text-sm">No items in bag yet</p>
            </div>
            <p v-if="currentBagItems.length > 0 && bagItems.length > 0" class="text-xs font-medium text-final-text-soft">New Items:</p>
            <div v-for="item in bagItems" :key="item.itemID" class="flex items-center justify-between bg-gray-100 p-3 rounded">
                <BagItems
                    :item="item"
                    @increase="emit('increase', $event, false)"
                    @decrease="emit('decrease', $event, false)"
                    @remove="emit('remove', $event, false)"
                />
            </div>
            <p v-if="currentBagItems.length > 0" class="text-xs font-medium text-final-text-soft">Current Emergency Bag Items:</p>
            <div v-for="item in currentBagItems" :key="item.itemID" class="flex items-center justify-between bg-gray-100 p-3 rounded">
                <BagItems
                    :item="item"
                    @increase="emit('increase', $event, true)"
                    @decrease="emit('decrease', $event, true)"
                    @remove="emit('remove', $event, true)"
                />
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import BagItems from '~/components/EmergencyBag/BagItems.vue'

defineProps<{
    bagItems: Array<{ itemID: string; count: number; name: string; imgName?: string }>
    currentBagItems: Array<{ itemID: string; count: number; name: string; imgName?: string }>
}>()

const emit = defineEmits<{
    increase: [itemID: string, isCurrentBag: boolean]
    decrease: [itemID: string, isCurrentBag: boolean]
    remove: [itemID: string, isCurrentBag: boolean]
}>()
</script>
