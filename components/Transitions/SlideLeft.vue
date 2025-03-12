<template lang="pug">
Transition(
	enter-active-class="transition duration-100 ease-out pointer-events-none"
	enter-from-class="transform translate-x-7 opacity-0"
	enter-to-class="transform translate-x-0 opacity-100"
	leave-active-class="transition duration-75 ease-in pointer-events-none"
	leave-from-class="transform translate-x-0 opacity-100"
	leave-to-class="transform translate-x-3 opacity-0"
)
	slot
</template>
