<template lang="pug">
div.bg-yellow-warningv2.w-full.h-24.flex.items-center.justify-center.px-3
    // Warning name/icon
    ExclamationTriangleIcon.w-10.h-10.flex-shrink-0
    p.text-base.font-medium.text-left.whitespace-normal.break-words.overflow-hidden.ml-3 {{ warningMessage }}
</template>

<script lang="ts" setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
    warningMessage: {
        type: String,
        default: "This is a very scary warning",
    },
})
</script>
