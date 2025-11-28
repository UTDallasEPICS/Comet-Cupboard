<template lang="pug">
//- Estimated wait time display:
div.min-w-72.w-full.flex.flex-col.flex-grow.border-2.border-utd-green.rounded-2xl.overflow-auto.bg-white
    
    //- Displays the heading for the estimated wait time display:
    div(class="text-[#154734]").flex.items-center.justify-center.text-xl.lg_text-5xl.font-bold.font-montserrat.w-full.h-10.lg_h-20
        p Estimated Wait Time:
    
    //- Displays the estimated wait time for the student in the queue:
    div(class="bg-[#eeeeee] w-11/12").flex.flex-col.items-center.justify-center.h-9.lg_h-24.rounded-2xl.mx-auto.text-xl.lg_text-5xl.font-bold.font-montserrat
        p {{time}}
    
    //- Applies some spacing between the estimated wait time and the end of the display box
    div.h-4
</template>
<script lang="ts" setup>
const props = defineProps<{
	time: String//Estimated wait time for the student in the queue
}>()
</script>