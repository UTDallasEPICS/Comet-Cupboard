<template lang="pug">
div
</template>

<script lang="ts" setup>
const milliseconds: number = 300
// dummy timer for skeleton loading to take more than X milliseconds to not flash users
const resolveSkeletonTimer = () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve("resolved")
		}, milliseconds)
	})
}

await resolveSkeletonTimer()
</script>
