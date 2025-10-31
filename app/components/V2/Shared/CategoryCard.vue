<template lang="pug">
button.bg-white.w-96.h-16.rounded-xl.flex.items-center.justify-between.pl-4.drop-shadow-standard
    p.text-base.text-cupboardv2-dg {{ categoryName }}
    div.relative.w-48.h-16.flex-shrink-0.overflow-hidden.rounded-r-xl
        img.w-full.h-full.object-cover(:src="imageSrc" alt="Category Image" :style="clipStyle")
</template>

<script lang="ts" setup>
const props = defineProps({
    categoryName: {
        type: String,
        default: "Category name",
    },
    imageSrc: {
        type: String,
        default: "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
    },
})

const clipStyle = 'clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 100%)'
</script>