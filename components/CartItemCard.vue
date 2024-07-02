<template lang="pug">
div.border-black.border-4.flex.flex-row.flex-nowrap
    img.aspect-square(class="w-16 lg:w-20" src="/TemporaryCometCupboardTransparent.png" alt="Food")
    div.w-full
        p.text-base.break-all.line-clamp-2(style="height: 3rem") Watermeloodqwpoqwkpn Watermelon Watermelon Watermelon
    div.grid.grid-rows-2
        XCircleIcon.w-8.min-w-8.aspect-square.place-self-start(style="margin-left: auto;")
        div.flex.flex-row.flex-nowrap.justify-end.place-self-end
            MinusCircleIcon.w-8
            p 12
            PlusCircleIcon.w-8
            
</template>

<script lang="ts" setup>
import { PlusCircleIcon, MinusCircleIcon, XCircleIcon } from "@heroicons/vue/24/outline"
</script>
