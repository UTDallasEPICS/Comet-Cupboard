<template>
	<div class="flex flex-col">
		<UButton color="neutral" variant="ghost" leading-icon="i-lucide-boxes" class="h-12 w-full" @click="emit('update:navigate-data', 'Current Inventory')">
			<SharedTextBase>Current Inventory</SharedTextBase>
		</UButton>
		<UButton
			color="neutral"
			variant="ghost"
			leading-icon="i-lucide-package-plus"
			class="h-12 w-full"
			@click="emit('update:navigate-data', 'Items Donated')"
		>
			<SharedTextBase>Items Donated</SharedTextBase>
		</UButton>
		<UButton
			color="neutral"
			variant="ghost"
			leading-icon="i-lucide-package-plus"
			class="h-12 w-full"
			@click="emit('update:navigate-data', 'Items Distributed')"
		>
			<SharedTextBase>Items Distributed</SharedTextBase>
		</UButton>
		<UButton
			color="neutral"
			variant="ghost"
			leading-icon="i-lucide-building"
			class="h-12 w-full"
			@click="emit('update:navigate-data', 'Source Contribution')"
		>
			<SharedTextBase>Source Contribution</SharedTextBase>
		</UButton>
		<UButton color="neutral" variant="ghost" leading-icon="i-lucide-users-round" class="h-12 w-full" @click="emit('update:navigate-data', 'Visitors')">
			<SharedTextBase>User Visits</SharedTextBase>
		</UButton>
		<UButton color="neutral" variant="ghost" leading-icon="i-lucide-clipboard-clock" class="h-12 w-full" @click="emit('update:navigate-data', 'Audit Log')">
			<SharedTextBase>Audit Log</SharedTextBase>
		</UButton>
	</div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["update:navigate-data"])
</script>
