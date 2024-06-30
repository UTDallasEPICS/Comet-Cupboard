<template lang="pug">
div.border-black.border-8.flex.flex-row.flex-nowrap
    img.aspect-square(class="w-16 lg:w-20" src="/TemporaryCometCupboardTransparent.png" alt="Food")
    div.w-full
        div.flex.flex-row.flex-nowrap
            p.text-base.overflow-hidden.overflow-ellipsis.break-all(style="height: 3rem") Watermelon Watermelon Watermelon Watermelon
            XCircleIcon.w-8.min-w-8.aspect-square(style="margin-left: auto; margin-bottom: auto")
        div.flex.flex-row.flex-nowrap.justify-end
            MinusCircleIcon.w-8
            div.w-10
            PlusCircleIcon.w-8
            
</template>

<script lang="ts" setup>
import { PlusCircleIcon, MinusCircleIcon, XCircleIcon } from "@heroicons/vue/24/outline"
</script>
