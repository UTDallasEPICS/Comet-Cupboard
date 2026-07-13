<template>
	<div class="flex items-center gap-2">
		<UButton size="xs" variant="soft" :icon="icons['refresh']" @click="refreshNow"> Auto refresh in {{ countdown }} </UButton>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	seconds: {
		type: Number,
		default: 60,
	},
})

const countdown = ref(props.seconds)
let interval

const refreshNow = () => {
	reloadNuxtApp()
}

onMounted(() => {
	interval = setInterval(() => {
		countdown.value--

		if (countdown.value <= 0) {
			refreshNow()
			countdown.value = 60
		}
	}, 1000)
})

onBeforeUnmount(() => {
	clearInterval(interval)
})
</script>
