<template>
    <div class="flex items-center gap-3">
        <!-- Image -->
        <img
            v-if="item.imgName"
            :src="`/api/public/image/${item.imgName}`"
            :alt="item.name"
            class="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
        />
        <div v-else class="w-12 h-12 bg-gray-300 rounded flex items-center justify-center">
            <span class="text-gray-500 text-xs">No Img</span>
        </div>

        <!-- Name -->
        <div>
            <p class="font-semibold text-sm">{{ item.name }}</p>
        </div>

        <div class="flex items-center gap-2">
            <UButton
                class="h-8 w-8 min-w-8 flex items-center justify-center rounded bg-gray-400 text-white hover:bg-gray-500" @click="$emit('decrease', item.itemID)"
            > − </UButton>
            <span class="w-8 text-center font-semibold tabular-nums">{{ item.count }}</span>
            <UButton
                class="h-8 w-8 min-w-8 flex items-center justify-center rounded bg-gray-400 text-white hover:bg-gray-500" @click="$emit('increase', item.itemID)"
            > + </UButton>

            <UButton
                class="h-8 w-8 min-w-8 flex items-center justify-center rounded bg-orange-600 text-white hover:bg-orange-700" @click="$emit('remove', item.itemID)"
            > ✕ </UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
  item: {
    itemID: string
    count: number
    name: string
    imgName?: string
  }
}>()

defineEmits(['increase', 'decrease', 'remove'])
</script>