<template>
	<UCard class="min-w-72">
		<template #header>
			<p>Data Pages</p>
		</template>
		<div>
			<UButton key="items-in" variant="outline" class="h-12 w-full justify-between" @click="emit('update:navigate-data', 'items-in')">
				<p>Items In</p>
			</UButton>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const emit = defineEmits(["update:navigate-data"])
</script>
