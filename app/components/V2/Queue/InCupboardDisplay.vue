<template lang="pug">
//- Cupboard display:
div.min-w-72.w-full.flex.flex-col.flex-grow.border-2.border-utd-green.rounded-2xl.overflow-auto.bg-white
    
    //- Displays the heading for the cupboard display:
    div.text-utd-green.flex.items-center.justify-center.text-xl.lg_text-5xl.font-bold.font-montserrat.w-full.h-10.lg_h-20
        p In Cupboard
    
    //- Displays the number of students in the cupboard:
    div(class="w-11/12").bg-cupboardv2-2elg.flex.flex-col.items-center.justify-center.h-9.lg_h-24.rounded-2xl.mx-auto.text-xl.lg_text-5xl.font-bold.font-montserrat
        p # of students: {{queue.length}}
    
    //- Applies some spacing between the number of students in the cupboard and the end of the display box
    div.h-4
</template>
<script lang="ts" setup>
const props = defineProps<{
	queue: string[]//List of students in the cupboard
}>()
</script>
