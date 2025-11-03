<template lang="pug">
div.relative.h-44.overflow-hidden(class="w-[500px]")
    // Ellipse background for the navbar
    div.absolute.top-0.left-0.w-full.h-full.bg-utd-green(:style="clipStyle")
    // Content layer for header title and hamburger button
    div.absolute.top-0.left-0.w-full.h-full.flex.flex-col.justify-between.z-10
        // Hamburger button and comet cupboard image
        div.flex.items-center.justify-start.px-4.pt-4
            button
                Bars3Icon.w-12.h-12.text-white(class="stroke-[3px]")
            div.relative.w-24.h-12.flex-shrink-0.overflow-hidden.ml-4
                img.w-full.h-full.object-contain(src="/CometCupboardLogo1.png" alt="Category Image")
        // Title centered near bottom of the nav bar
        div.flex.justify-center.pb-8 
            p.text-3xl.font-bold.text-white {{ headerTitle }}
            
</template>

<script lang="ts" setup>
const props = defineProps({
    headerTitle: {
        type: String,
        default: "Header title",
    },
})

const clipStyle = 'clip-path: ellipse(60% 100% at 50% 0%)'

import { Bars3Icon } from '@heroicons/vue/24/outline'
</script>
