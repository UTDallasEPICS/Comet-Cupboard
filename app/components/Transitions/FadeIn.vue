<template lang="pug">
Transition(
	enter-active-class="transition duration-150 ease-out"
	enter-from-class="opacity-0"
	enter-to-class="opacity-100"
	leave-active-class="transition duration-100 ease-in"
	leave-from-class="opacity-100"
	leave-to-class="opacity-0"
	appear
)
	slot
</template>
