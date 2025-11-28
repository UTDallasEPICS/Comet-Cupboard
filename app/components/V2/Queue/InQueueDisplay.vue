<template lang="pug">
//- Queue display:
div.min-w-72.lg_w-full.flex.flex-col.flex-grow.border-2.border-utd-green.rounded-2xl.overflow-auto.bg-white
    
    //- Displays the heading for the queue display:
    div(class="text-[#154734]").flex.items-center.justify-center.text-xl.lg_text-5xl.font-bold.font-montserrat.w-full.h-10.lg_h-20
        p In Queue
    
    //- No matter what if the queue is empty, display a message that it is empty
    div(v-if="queue.length == 0" class="w-11/12 bg-[#eeeeee]").font-bold.font-montserrat.flex.items-center.justify-center.ml-auto.mr-auto.rounded-xl.text-center.text-base.lg_text-5xl.h-72.lg_h-96
        p No students waiting in the queue at this time
    
    //- For volunteers, display the first 5 people in the queue with control elements
    div(v-else-if="permissions['VERIFY_CART']" class="w-11/12 bg-[#eeeeee]").overflow-auto.mx-auto.rounded-xl.h-72.lg_h-96
        div(v-for="(queueItem, index) in queue.slice(0, 5)" :key="index")
            V2QueueCard(:identification="queueItem" :position="index + 1")
    
    //- For students, displays the number of students in the queue:
    div(v-else class="bg-[#eeeeee] w-11/12").flex.flex-col.items-center.justify-center.h-9.lg_h-24.rounded-2xl.mx-auto.text-xl.lg_text-5xl.font-bold.font-montserrat
        p # of students: {{queue.length}}
    
    //- Applies some spacing between the list of students in the queue and the end of the display box
    div.h-4
</template>

<script lang="ts" setup>
const props = defineProps<{
	queue: string[]//List of students in the queue
}>()

//User permissions:
const accessCookie = ref(useCookie("AccessPermission"))
const permissions = ref(accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {}) //Dirty
</script>
