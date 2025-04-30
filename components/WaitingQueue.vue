<template lang="pug">
div.w-full.flex.flex-col.border-2.border-black.rounded-md
	div.text-2xl.font-bold.text-center.border-b-2.border-black
		| In Queue
	//- For volenteers, display the first 5 people in the queue with control elements
	div(v-if="permissions['VERIFY_CART']" as="div").flex.flex-col.justify-start.items-start
		div.pb-2.w-full
			div(v-for="(queueItem, index) in queue.slice(0, 5)" :key="index")
				QueueHeader(:identification="queueItem" :position="index + 1")
		//-Display the rest as text
		div(v-for="(queueItem, index) in queue.slice(5)" :key="index").w-full.mb-1
			div.flex.justify-start.pl-2
				| {{ index + 6 }} {{ queueItem }}

	//- All other users see everyone in the queue with no control elements
	div(v-else as="div").flex.flex-col.justify-start.items-start
		div(v-for="(queueItem, index) in queue" :key="index").w-full.mb-1
			div.flex.justify-start.pl-2
				| {{ index + 1 }} {{ queueItem }}
</template>

<script lang="ts" setup>
const queue = ref([
	"Mary",
	"John",
	"Holly",
	"Noelle",
	"Man",
	"Steve",
	"Alice",
	"Bob",
	"Charlie",
	"Diana",
	"Eve",
	"Frank",
	"Grace",
	"Hank",
	"Ivy",
	"Jack",
] as string[])
const accessCookie = ref(useCookie("AccessPermission"))
const permissions = ref(accessCookie.value && typeof accessCookie.value === "object" ? accessCookie.value : {}) //Dirty
</script>
