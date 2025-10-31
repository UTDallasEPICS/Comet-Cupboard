<template lang="pug">
div.bg-yellow-warningv2.w-96.h-24.flex.items-center.justify-center.gap-x-5
    // Warning name/icon
    ExclamationTriangleIcon.w-16.h-16.ml-5
    p.text-base.font-medium {{ warningName }}
</template>

<script lang="ts" setup>
const props = defineProps({
    warningName: {
        type: String,
        default: "This is a very scary warning",
    },
})

import { ExclamationTriangleIcon } from '@heroicons/vue/24/solid'
</script>
