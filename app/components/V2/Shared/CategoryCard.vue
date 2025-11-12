<template lang="pug">
NuxtLink(:to="`/v2/inventory/${categoryName}`" class="w-full")
    button.bg-white.w-full.h-20.rounded-xl.flex.items-stretch.justify-between.overflow-hidden.pl-2.drop-shadow-standard
        div.flex.items-center.flex-1.px-4.w-full
            p.text-base.text-cupboardv2-dg.font-normal {{ categoryName }}
        div.relative.w-48.h-full.flex-shrink-0.overflow-hidden.rounded-r-xl
            img.w-full.h-full.object-cover(v-if="imageSrc" :src="imageSrc" :alt="categoryName" :style="clipStyle")
            PhotoIcon.w-full.h-full.txt-cupboardv2-dg(v-else)
</template>

<script lang="ts" setup>
import { PhotoIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    categoryName: {
        type: String,
        default: "Category name",
    },
    imageSrc: {
        type: String,
        default: '',
    },
})

// Creates a diagonal line styling with specified percentages to adjust the angle
const clipStyle = 'clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 100%)'
</script>