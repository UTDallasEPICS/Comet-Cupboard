<template>
	<UCard :ui="{ body: 'p-0 sm:p-0' }">
		<template #header>
			<div class="flex flex-col gap-3">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div>
						<SharedTextBase class="text-xs font-medium tracking-wide text-gray-500 uppercase">Underlying data</SharedTextBase
						><SharedTextSectionTitle class="mt-1">{{ title }}</SharedTextSectionTitle>
					</div>
					<div class="flex items-center gap-2">
						<USelect v-model="exportFormat" :items="exportFormats" variant="ghost" class="w-24 data-[state=open]:bg-gray-100" />
						<UTooltip :text="exportHref ? 'Export data' : 'Export unavailable for this table'">
							<SharedButtonActionButton
								icon="i-lucide-download"
								action="positive"
								aria-label="Export data"
								:disabled="!exportHref"
								:to="resolvedExportHref"
								target="_blank"
							/>
						</UTooltip>
					</div>
				</div>
				<div class="flex flex-wrap items-center gap-2">
					<UInput v-if="searchable" v-model="search" icon="i-lucide-search" placeholder="Search table" class="w-full sm:w-64" />
					<slot name="filters" />
				</div>
			</div>
		</template>
		<div class="overflow-x-auto">
			<table class="min-w-full text-sm">
				<thead class="bg-gray-50 text-left text-xs tracking-wide text-gray-500 uppercase">
					<tr>
						<th
							v-for="column in columns"
							:key="column.key"
							class="px-4 py-3 font-medium"
							:class="{ 'cursor-pointer hover:text-gray-700 select-none': sortable }"
							@click="sortable && toggleSort(column.key)"
						>
							<span class="inline-flex items-center gap-1">
								{{ column.label }}
								<SharedIcon v-if="sortable && sortKey === column.key" :name="sortAsc ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'" class="size-3" />
							</span>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					<tr
						v-for="(row, index) in displayedRows"
						:key="index"
						:class="{ 'cursor-pointer hover:bg-gray-50': rowHref?.(row) }"
						@click="rowHref?.(row) && navigateTo(rowHref!(row))"
					>
						<td v-for="column in columns" :key="column.key" class="px-4 py-3 text-gray-700">{{ row[column.key] }}</td>
					</tr>
					<tr v-if="!displayedRows.length">
						<td :colspan="columns.length" class="px-4 py-8 text-center text-gray-500">No data for this period.</td>
					</tr>
				</tbody>
			</table>
		</div>
	</UCard>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		title: string
		columns: Array<{ key: string; label: string }>
		rows: Array<Record<string, string | number>>
		exportHref?: string
		searchable?: boolean
		sortable?: boolean
		rowHref?: (row: Record<string, string | number>) => string | undefined
	}>(),
	{
		searchable: true,
		sortable: true,
		rowHref: undefined,
	}
)

const exportFormats = ["xlsx", "csv"]
const exportFormat = ref<(typeof exportFormats)[number]>("xlsx")

const resolvedExportHref = computed(() => {
	if (!props.exportHref) {
		return undefined
	}

	const separator = props.exportHref.includes("?") ? "&" : "?"
	return `${props.exportHref}${separator}format=${exportFormat.value}`
})

const search = ref("")
const sortKey = ref<string | null>(null)
const sortAsc = ref(true)

const toggleSort = (key: string) => {
	if (sortKey.value !== key) {
		sortKey.value = key
		sortAsc.value = true
	} else if (sortAsc.value) {
		sortAsc.value = false
	} else {
		sortKey.value = null
	}
}

const searchedRows = computed(() => {
	const query = search.value.trim().toLowerCase()
	if (!query) return props.rows
	return props.rows.filter((row) => props.columns.some((column) => String(row[column.key] ?? "").toLowerCase().includes(query)))
})

const displayedRows = computed(() => {
	if (!sortKey.value) return searchedRows.value
	const key = sortKey.value
	return [...searchedRows.value].sort((first, second) => {
		const firstValue = first[key]
		const secondValue = second[key]
		const comparison =
			typeof firstValue === "number" && typeof secondValue === "number"
				? firstValue - secondValue
				: String(firstValue ?? "").localeCompare(String(secondValue ?? ""))
		return sortAsc.value ? comparison : -comparison
	})
})
</script>
