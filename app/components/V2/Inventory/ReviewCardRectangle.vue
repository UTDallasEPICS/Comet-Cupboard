<template lang="pug">
div.bg-white.w-80.h-24.rounded-xl.flex.items-center.drop-shadow-standard.relative
    // Image container
    div.relative.w-16.h-16.flex-shrink-0.overflow-hidden.ml-5
        img.w-full.h-full.object-cover(v-if="imageSrc" :src="imageSrc" :alt="itemName")
        PhotoIcon.w-full.h-full.txt-cupboardv2-dg(v-else)
    // Text container (flex vertical)
    div.flex.gap-x-9.items-center.justify-center
        div.flex.flex-col.ml-10.gap-y-1.items-center.justify-center
            // Item name and in stock
            p.text-lg.text-cupboardv2-dg.font-semibold {{ itemName }}
            div.flex.-translate-y-1
                p.text-sm.text-cupboardv2-dg Count: {{ itemCount }}
        p.text-lg.text-cupboardv2-dg.font-bold {{ adjustedCount }}
</template>

<script lang="ts" setup>
import { PhotoIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    itemName: {
        type: String,
        default: "Item name",
    },
    itemCount: {
        type: String,
        default: "#",
    },
    adjustedCount: {
        type: String,
        default: "+??",
    },
    imageSrc: {
        type: String,
        default: '',
    },
})
</script>