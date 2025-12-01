<template lang="pug">
//- Estimated wait time display:
div.min-w-72.w-full.flex.flex-col.flex-grow.border-2.border-utd-green.rounded-xl.overflow-auto.bg-white.px-4.pb-4
    
    //- Displays the heading for the estimated wait time display:
    div.text-utd-green.flex.items-center.justify-center.text-xl.font-bold.w-full.h-10
        p Estimated Wait Time:
    
    //- Displays the estimated wait time for the student in the queue:
    div.w-full.bg-cupboardv2-2elg.flex.flex-col.items-center.justify-center.h-9.rounded-xl
        p {{time}}
</template>
<script lang="ts" setup>
const props = defineProps<{
	time: string//Estimated wait time for the student in the queue
}>()
</script>