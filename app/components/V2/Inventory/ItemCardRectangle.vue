<template lang="pug">
div.bg-white.w-80.h-24.rounded-xl.flex.items-center.justify-between.drop-shadow-standard.relative
    // Settings/options button
    button.absolute.top-3.right-4.flex.items-center.justify-center
        span.flex(class="gap-[2px]")
            span.w-1.h-1.bg-cupboardv2-dg.rounded-full
            span.w-1.h-1.bg-cupboardv2-dg.rounded-full
            span.w-1.h-1.bg-cupboardv2-dg.rounded-full
    // Text container (flex vertical)
    div.flex.flex-col.ml-5.gap-y-1
        // Item name and in stock
        p.text-base.text-cupboardv2-dg.font-semibold {{ itemName }}
        div.flex.gap-x-3.-translate-y-1
            p.text-sm.text-cupboardv2-dg In Stock:
            div.bg-white.w-24.h-5.border-cupboardv2-dg.rounded-xl.flex.justify-end.box-border.relative(class="border-[1px]")
                div.flex.items-center.justify-center
                    span.text-sm.text-black.mr-2 0
                div.bg-cupboardv2-elg.w-14.rounded-r-xl.flex.items-center.justify-center(:style="clipStyle")
                    span.text-sm.text-black +0
        // Inventory adjustment buttons (flex horizontal)
        div.flex.gap-x-3
            button.w-5.h-5.bg-cupboardv2-dg.rounded-full.flex.items-center.justify-center
                MinusIcon.w-4.h-4.text-white(class="stroke-[3px]")
            div.relative.flex.flex-col.items-center
                input.w-6.bg-transparent.outline-none.border-none.text-base.text-center.text-black(type="text" placeholder="#")
                div.bg-cupboardv2-dg.w-7.rounded-xl.-mt-1(class="h-[2px]")
            button.w-5.h-5.bg-cupboardv2-dg.rounded-full.flex.items-center.justify-center
                PlusIcon.w-4.h-4.text-white(class="stroke-[3px]")
    // Image container
    div.relative.w-14.h-14.flex-shrink-0.overflow-hidden.mr-8
        img.w-full.h-full.object-cover(:src="imageSrc" alt="Category Image")
</template>

<script lang="ts" setup>
const props = defineProps({
    itemName: {
        type: String,
        default: "Item name",
    },
    imageSrc: {
        type: String,
        default: "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
    },
})

const clipStyle = 'clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 100%)'

import { MinusIcon } from '@heroicons/vue/24/outline'
import { PlusIcon } from '@heroicons/vue/24/outline'
</script>