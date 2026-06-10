<template>
	<div class="flex flex-col gap-2">
		<UButton leading-icon="i-lucide-grid-2x2" trailing-icon="i-lucide-chevron-down" variant="ghost" color="neutral">Dashboard</UButton>
		<UButton key="Items Donated" variant="outline" leading-icon="" class="h-12 w-full justify-center" @click="emit('update:navigate-data', 'Items Donated')">
			<p>Items Donated</p>
		</UButton>
		<UButton key="Items Distributed" variant="outline" class="h-12 w-full justify-center" @click="emit('update:navigate-data', 'Items Distributed')">
			<p>Items Distributed</p>
		</UButton>
		<UButton key="Inventory" variant="outline" class="h-12 w-full justify-center" @click="emit('update:navigate-data', 'Inventory')">
			<p>Current Inventory</p>
		</UButton>
		<UButton key="Source Contribution" variant="outline" class="h-12 w-full justify-center" @click="emit('update:navigate-data', 'Source Contribution')">
			<p>Source Contribution</p>
		</UButton>
		<UButton key="Visitors" variant="outline" class="h-12 w-full justify-center" @click="emit('update:navigate-data', 'Visitors')">
			<p>User Visits</p>
		</UButton>
		<UButton key="Audit Log" variant="outline" class="h-12 w-full justify-center" @click="emit('update:navigate-data', 'Audit Log')">
			<p>Audit Log</p>
		</UButton>
	</div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["update:navigate-data"])
</script>
