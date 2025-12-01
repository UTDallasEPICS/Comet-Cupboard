<template lang="pug">
//- Cupboard display:
div.min-w-72.w-full.flex.flex-col.flex-grow.border-2.border-utd-green.rounded-xl.overflow-auto.bg-white.px-4.pb-4
    
    //- Displays the heading for the cupboard display:
    div.text-utd-green.flex.items-center.justify-center.text-xl.font-bold.w-full.h-10
        p In Cupboard
    //- Displays the number of students in the cupboard:
    div.w-full.bg-cupboardv2-2elg.flex.flex-col.items-center.justify-center.h-9.rounded-xl
        p # of students: {{queue.length}}
</template>
<script lang="ts" setup>
const props = defineProps<{
	queue: string[]//List of students in the cupboard
}>()
</script>
