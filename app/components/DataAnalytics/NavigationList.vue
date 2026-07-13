<template>
	<div class="flex flex-col">
		<UButton color="neutral" variant="ghost" leading-icon="i-lucide-package-plus" class="h-12 w-full" @click="emit('update:navigate-data', 'Items Donated')">
			<p>Items Donated</p>
		</UButton>
		<UButton color="neutral" variant="ghost" leading-icon="i-lucide-package-plus" class="h-12 w-full" @click="emit('update:navigate-data', 'Items Distributed')">
			<p>Items Distributed</p>
		</UButton>
		<UButton color="neutral" variant="ghost" leading-icon="i-lucide-boxes" class="h-12 w-full" @click="emit('update:navigate-data', 'Current Inventory')">
			<p>Current Inventory</p>
		</UButton>
		<UButton color="neutral" variant="ghost" leading-icon="i-lucide-building" class="h-12 w-full" @click="emit('update:navigate-data', 'Source Contribution')">
			<p>Source Contribution</p>
		</UButton>
		<UButton color="neutral" variant="ghost" leading-icon="i-lucide-users-round" class="h-12 w-full" @click="emit('update:navigate-data', 'Visitors')">
			<p>User Visits</p>
		</UButton>
		<UButton color="neutral" variant="ghost" leading-icon="i-lucide-clipboard-clock" class="h-12 w-full" @click="emit('update:navigate-data', 'Audit Log')">
			<p>Audit Log</p>
		</UButton>
	</div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["update:navigate-data"])
</script>
