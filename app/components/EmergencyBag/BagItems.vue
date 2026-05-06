<template>
    <div class="flex items-center gap-3 w-full">
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

        <div class="flex items-center gap-1 ml-auto">
            <UButton icon="i-lucide-minus" size="md" variant="soft" color="neutral" @click="$emit('decrease', item.itemID)" />
            <span class="w-8 text-center font-semibold tabular-nums">{{ item.count }}</span>
            <UButton icon="i-lucide-plus" size="md" variant="soft" color="neutral" @click="$emit('increase', item.itemID)" />
            <UButton icon="i-lucide-x" size="md" variant="soft" color="error" @click="$emit('remove', item.itemID)" />
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