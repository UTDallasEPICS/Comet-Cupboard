<template lang="pug">
//- Queue display:
div.min-w-72.flex.flex-col.flex-grow.border-2.border-utd-green.rounded-xl.overflow-auto.bg-white.px-4.pb-4
    
    //- Displays the heading for the queue display:
    div.text-utd-green.flex.items-center.justify-center.text-xl.font-bold.w-full.h-10
        p In Queue
    
    //- No matter what if the queue is empty, display a message that it is empty
    div(v-if="queue.length == 0").w-full.p-4.bg-cupboardv2-2elg.flex.items-center.justify-center.rounded-xl.text-center.h-72
        p No students waiting in the queue at this time
    
    //- For volunteers, display the first 5 people in the queue with control elements
    div(v-else-if="permissions['VERIFY_CART']").w-full.p-4.bg-cupboardv2-2elg.overflow-auto.mx-auto.rounded-xl.h-72.flex.flex-col.gap-y-4
        div(v-for="(queueItem, index) in queue.slice(0, 5)" :key="index")
            V2QueueCard(:identification="queueItem" :position="index + 1")
    
    //- For students, displays the number of students in the queue:
    div(v-else).w-full.p-4.bg-cupboardv2-2elg.flex.items-center.justify-center.h-9.rounded-xl
        p # of students: {{queue.length}}
</template>

<script lang="ts" setup>
const props = defineProps<{
	queue: string[]//List of students in the queue
}>()

//User permissions:
const accessCookie = ref(useCookie("AccessPermission"))
const permissions = ref(accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {}) //Dirty
</script>
