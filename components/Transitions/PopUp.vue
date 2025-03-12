<template lang="pug">
Transition(
	enter-active-class="transition duration-100 ease-out pointer-events-none"
	enter-from-class="transform scale-50 opacity-0"
	enter-to-class="transform scale-100 opacity-100"
	leave-active-class="transition duration-75 ease-in pointer-events-none"
	leave-from-class="transform scale-100 opacity-100"
	leave-to-class="transform scale-90 opacity-0"
)
	slot
</template>
