<template lang="pug">
div.bg-white.w-full.h-24.rounded-xl.flex.items-center.drop-shadow-standard.px-4
    // Image container
    div.relative.w-16.h-16.flex-shrink-0.overflow-hidden
        img.w-full.h-full.object-cover(v-if="imgName" :src="`/api/image/${imgName}`" :alt="itemName")
        PhotoIcon.w-full.h-full.txt-cupboardv2-dg(v-else)
    // Text Container
    div.flex.flex-1.items-center.justify-between.ml-4
        // Item Name + Updated Count
        div.flex.flex-col.items-center.justify-center
            p.text-lg.text-cupboardv2-dg.font-semibold {{ itemName }}
            p.text-sm.text-cupboardv2-dg Updated Count: {{ adjustedCount }}
        // Change in Count
        p.text-lg.text-cupboardv2-dg.font-bold {{ changeInCount }}
</template>

<script lang="ts" setup>
import { PhotoIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    itemName: {
        type: String,
        default: "Item name",
    },
    itemCount: {
        type: Number,
        default: "#",
    },
    adjustedCount: {
        type: Number,
        default: "??",
    },
    imgName: {
        type: String,
        default: '',
    },
})

const changeInCount = computed(() => {
    const dif = props.adjustedCount - props.itemCount 
    return dif > 0 ? `+${dif}` : `${dif}`
})
</script>