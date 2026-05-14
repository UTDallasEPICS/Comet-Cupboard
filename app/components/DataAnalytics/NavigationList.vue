<template>
	<UCard class="min-w-72">
		<template #header>
			<p>Data Pages</p>
		</template>
		<div class="flex flex-col gap-2">
			<UButton key="items-in" variant="outline" class="h-12 w-full justify-center" @click="emit('update:navigate-data', 'items-in')">
				<p>Items In</p>
			</UButton>
			<UButton key="inventory" variant="outline" class="h-12 w-full justify-center" @click="emit('update:navigate-data', 'inventory')">
				<p>Current Inventory</p>
			</UButton>
			<UButton key="sourceContribution" variant="outline" class="h-12 w-full justify-center" @click="emit('update:navigate-data', 'sourceContribution')">
				<p>Source Contribution</p>
			</UButton>
			<UButton key="visitors" variant="outline" class="h-12 w-full justify-center" @click="emit('update:navigate-data', 'visitors')">
				<p>User Visits</p>
			</UButton>
			<UButton key="items-in" variant="outline" class="h-12 w-full justify-center" @click="emit('update:navigate-data', 'items-in')">
				<p>Audit Log</p>
			</UButton>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const emit = defineEmits(["update:navigate-data"])
</script>
