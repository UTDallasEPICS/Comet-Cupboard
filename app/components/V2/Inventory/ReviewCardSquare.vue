<template lang="pug">
div.bg-white.w-96.h-96.rounded-xl.flex.flex-col.items-center.gap-3.justify-top.drop-shadow-standard.relative
    // Image container
    div.relative.w-52.h-52.flex-shrink-0.overflow-hidden.mt-8
        img.w-full.h-full.object-cover(:src="imageSrc" alt="Category Image")
    // Text container (flex vertical)
    div.flex.flex-col.items-center.gap-4
        // Item name and in stock
        p.text-3xl.text-cupboardv2-dg.font-semibold {{ itemName }}
    p.text-2xl.text-cupboardv2-dg.absolute.bottom-6.left-7 Count: {{ itemCount }}
    p.text-2xl.text-cupboardv2-dg.font-bold.absolute.bottom-6.right-7 {{ adjustedCount }}
</template>

<script lang="ts" setup>
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
        default: "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
    },
})
</script>
