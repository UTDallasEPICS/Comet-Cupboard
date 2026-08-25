<template>
	<UCard :ui="{ body: 'p-0 sm:p-0' }">
		<template #header>
			<div class="flex items-center justify-between gap-3">
				<div>
					<SharedTextBase class="text-xs font-medium tracking-wide text-gray-500 uppercase">Underlying data</SharedTextBase
					><SharedTextSectionTitle class="mt-1">{{ title }}</SharedTextSectionTitle>
				</div>
				<UTooltip text="Export will be available soon"
					><SharedButtonActionButton icon="i-lucide-download" color="neutral" variant="outline" disabled aria-label="Export data"
				/></UTooltip>
			</div>
		</template>
		<div class="overflow-x-auto">
			<table class="min-w-full text-sm">
				<thead class="bg-gray-50 text-left text-xs tracking-wide text-gray-500 uppercase">
					<tr>
						<th v-for="column in columns" :key="column.key" class="px-4 py-3 font-medium">{{ column.label }}</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					<tr v-for="(row, index) in rows" :key="index">
						<td v-for="column in columns" :key="column.key" class="px-4 py-3 text-gray-700">{{ row[column.key] }}</td>
					</tr>
					<tr v-if="!rows.length">
						<td :colspan="columns.length" class="px-4 py-8 text-center text-gray-500">No data for this period.</td>
					</tr>
				</tbody>
			</table>
		</div>
	</UCard>
</template>

<script setup lang="ts">
defineProps<{ title: string; columns: Array<{ key: string; label: string }>; rows: Array<Record<string, string | number>> }>()
</script>
