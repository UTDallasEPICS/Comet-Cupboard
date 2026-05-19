<template>
	<UCard class="min-w-72">
		<template #header>
			<p>Data Pages</p>
		</template>
		<div class="flex flex-col gap-2">
			<UButton key="items-in" variant="outline" class="h-12 w-full justify-center" @click="emit('update:navigate-data', 'items-in')">
				<p>Items In</p>
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
			<UButton key="items-in" variant="outline" class="h-12 w-full justify-center" @click="emit('update:navigate-data', 'items-in')">
				<p>Audit Log</p>
			</UButton>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
const emit = defineEmits(["update:navigate-data"])
</script>
