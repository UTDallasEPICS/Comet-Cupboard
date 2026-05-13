<template>
    <UCard>
        <template #header>
            <SharedTextCardTitle>Search Product</SharedTextCardTitle>
        </template>
        <div class="bg-gray-100 rounded-t-lg px-4 py-3">
            <UInput
                v-model="searchQuery"
                icon="i-lucide-search"
                placeholder="Search items"
                variant="outline"
                class="w-full"
            />
        </div>
        <div class="overflow-y-auto h-fit max-h-120 px-3 py-3 space-y-3">
            <div v-if="!filteredItems.length" class="text-center py-8">
                <p class="text-final-text-soft text-sm">Search results will appear here</p>
            </div>
            <div
                v-for="item in filteredItems"
                :key="item.itemID"
                :class="[
                    'flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded gap-3 transition',
                    getAvailableQuantity(item.itemID) <= 0
                        ? 'bg-gray-200 opacity-60 grayscale cursor-not-allowed'
                        : 'bg-gray-100'
                ]"
            >
                <img
                    v-if="item.imgName && item.categoryName"
                    :src="`/api/public/image/${item.imgName}`"
                    :alt="item.name"
                    class="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded shrink-0"
                >
                <div v-else class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded flex items-center justify-center shrink-0">
                    <span class="text-gray-500 text-xs">No Img</span>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-semibold text-sm truncate">{{ item.name }}</p>
                    <p class="text-xs text-final-text-soft">Available: {{ getAvailableQuantity(item.itemID) }} / {{ item.quantity }}</p>
                </div>
                <UButton
                    size="sm"
                    :disabled="getAvailableQuantity(item.itemID) <= 0"
                    variant="solid"
                    :ui="{ base: 'bg-final-utd-green' }"
                    @click="emit('add', item)"
                >+ Add</UButton>
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{
    inventoryItems: Array<{
        itemID: string
        name: string
        imgName?: string
        categoryName?: string
        quantity: number
    }> | null
    bagItems: Array<{ itemID: string; count: number }>
    currentBagItems: Array<{ itemID: string; count: number }>
}>()

const emit = defineEmits<{
    add: [item: any]
}>()

const searchQuery = ref('')

const filteredItems = computed(() => {
    if (!props.inventoryItems) return []
    if (!searchQuery.value) return props.inventoryItems
    const query = searchQuery.value.toLowerCase()
    return props.inventoryItems.filter(item => item.name.toLowerCase().startsWith(query))
})

const getAvailableQuantity = (itemID: string): number => {
    const item = props.inventoryItems?.find(i => i.itemID === itemID)
    if (!item) return 0
    const newItem = props.bagItems.find(i => i.itemID === itemID)
    const currentItem = props.currentBagItems.find(i => i.itemID === itemID)
    return item.quantity - (newItem?.count || 0) - (currentItem?.count || 0)
}

const resetSearch = () => { searchQuery.value = '' }

defineExpose({ resetSearch })
</script>
