<template lang="pug">
div.bg-white.w-64.h-8.rounded-xl.flex.items-center.justify-between
    MagnifyingGlassIcon.w-6.h-6.stroke-2.pl-2.text-cupboardv2-dg
    input.w-full.bg-transparent.outline-none.border-none.text-base.font-bold.text-cupboardv2-lg.pl-2(type="text" placeholder="Search Item")
</template>

<script lang="ts" setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
</script>
