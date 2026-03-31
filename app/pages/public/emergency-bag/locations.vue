<template>
  <div>
  <UContainer class="py-8">
    <header>
			<SharedTextPageTitle>Locations</SharedTextPageTitle>
		</header>

    <section class="mt-4">
      <div class="space-y-12">
        <section v-for="location in activeLocations" :key="location.name" class="space-y-4">
          <div class="flex justify-between items-end px-1">
            <div>
              <SharedTextCardTitle>{{ location.name }}</SharedTextCardTitle>
              <SharedTextBase class="text-xs text-gray-500">{{ location.address }}</SharedTextBase>
            </div>
            <UBadge variant="outline" color="primary" size="md">
              Total Bags: {{ location.emergencyBags }}
            </UBadge>
          </div>

          <UTable :data="getTableData(location.categoryCounts)" :columns="tableColumns" empty="No bags currently available" />

        </section>

        <footer class="mt-12">
          <USeparator class="mb-6" />
            <div class="flex gap-3 items-start">
              <UIcon name="i-heroicons-information-circle" class="text-gray-400 text-xl mt-0.5" />
              <SharedTextBase class="text-sm text-gray-600">
                <strong>*</strong> Not 100% nut-free
              </SharedTextBase>
            </div>
        </footer>
      </div>

    <footer class="mt-8 flex justify-end">
      <SharedButtonPositiveAction text="Refresh Data" @click="refresh" />
    </footer>
    
  </section>
  </UContainer>
  </div>
</template>

<script setup lang="ts">

interface LocationData {
  name: string
  address: string
  archived: boolean
  emergencyBags: number
  categoryCounts: Record<string, number>
}

const { data: locations, pending, refresh } = await useFetch<LocationData[]>('/api/public/location/locations')

const categoryMap: Record<string, string> = {
  'NONVEGETARIAN_AND_NON_PEANUT_BUTTER': 'Non-Veg and Nut-Free*',
  'VEGETARIAN_AND_NON_PEANUT_BUTTER': 'Veg and Nut-Free*',
  'NONVEGETARIAN_AND_PEANUT_BUTTER': 'Non-Veg and Nut',
  'VEGETARIAN_AND_PEANUT_BUTTER': 'Veg and Nut',
}

const getTableData = (categoryCounts: Record<string, number>) => {
  return Object.keys(categoryMap).map((key) => ({
    category: categoryMap[key], 
    count: (categoryCounts?.[key] ?? 0).toString()
  }))
}

const columnsDef = [
	{ header: "Bag Category", accessorKey: "category", type: "text"},
	{ header: "Quantity Available", accessorKey: "count", type: "text"},
]

const activeLocations = computed(() => {
  return locations.value?.filter(loc => !loc.archived) ?? []
})

const tableColumns = buildNuxtUITable(columnsDef, {})

</script>