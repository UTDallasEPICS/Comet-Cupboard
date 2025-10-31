<template lang="pug">
div.bg-white.w-96.h-96.rounded-xl.flex.flex-col.items-center.gap-3.justify-top.drop-shadow-standard.relative
    // Settings/options button
    button.absolute.top-5.right-5.flex.items-center.justify-center
        span.flex.gap-1
            span.w-2.h-2.bg-cupboardv2-dg.rounded-full
            span.w-2.h-2.bg-cupboardv2-dg.rounded-full
            span.w-2.h-2.bg-cupboardv2-dg.rounded-full
    // Image container
    div.relative.w-36.h-36.flex-shrink-0.overflow-hidden.mt-8
        img.w-full.h-full.object-cover(:src="imageSrc" alt="Category Image")
    // Text container (flex vertical)
    div.flex.flex-col.items-center.gap-4
        // Item name and in stock
        p.text-3xl.text-cupboardv2-dg.font-semibold {{ categoryName }}
        div.flex.gap-3
            p.text-base.text-cupboardv2-dg In Stock:
            div.bg-white.w-48.h-8.border-2.border-cupboardv2-dg.rounded-2xl.flex.justify-end.box-border.relative
                div.flex.items-center.justify-center
                    span.text-base.text-black.mr-7 0
                div.bg-cupboardv2-elg.w-28.rounded-r-2xl.flex.items-center.justify-center(:style="clipStyle")
                    span.text-base.text-black +0
        // Inventory adjustment buttons (flex horizontal)
        div.flex.gap-6.mt-2
            button.w-12.h-12.bg-cupboardv2-dg.rounded-full.flex.items-center.justify-center
                MinusIcon.w-8.h-8.text-white(class="stroke-[3px]")
            div.relative.flex.flex-col.items-center.mt-4
                input.bg-transparent.w-12.-mb-1.outline-none.border-none.text-2xl.text-center.text-black(type="text" placeholder="#")
                div.bg-cupboardv2-dg.w-12.h-1.rounded-xl
            button.w-12.h-12.bg-cupboardv2-dg.rounded-full.flex.items-center.justify-center
                PlusIcon.w-8.h-8.text-white(class="stroke-[3px]")
</template>

<script lang="ts" setup>
const props = defineProps({
    categoryName: {
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
