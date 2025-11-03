<template lang="pug">
div.relative(class="w-[500px]")
    // Top bar with hamburger and logo
    div.bg-utd-green.h-20.flex.items-center.px-4 
        button 
            Bars3Icon.w-12.h-12.text-white(class="stroke-[3px]")
        div.relative.w-24.h-10.flex-shrink-0.overflow-hidden.ml-4 
            img.w-full.h-full.object-contain(src="/CometCupboardLogo1.png" alt="Category Image")
    // Bottom bar with header title
    div.bg-utd-orange.h-14.flex.items-center.justify-center 
        p.text-2xl.font-bold.text-white {{ headerTitle }}
</template>

<script lang="ts" setup>
const props = defineProps({
    headerTitle: {
        type: String,
        default: "Header title",
    },
})

import { Bars3Icon } from '@heroicons/vue/24/outline'
</script>
