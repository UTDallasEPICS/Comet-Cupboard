<template>
  <div>
    <UContainer class="py-8">
      <header class="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div class="sm:absolute sm:left-0">
          <SharedButtonNavigateBack text="Back" :to="{ path: '/' }" />
        </div>

        <div class="w-full text-center">
          <SharedTextPageTitle>Locations</SharedTextPageTitle>
        </div>

        <div class="flex flex-col items-center gap-2 sm:flex-row sm:absolute sm:right-0 sm:gap-3">
          <SharedTextBaseSecondary class="text-xs sm:text-sm">
            Auto refresh in {{ countdown }}s
          </SharedTextBaseSecondary>

          <UButton size="xs" variant="soft" :icon="icons['refresh']" @click="refreshNow" class="whitespace-nowrap">
            Refresh now </UButton>
        </div>
      </header>

      <section class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <UCard v-for="location in activeLocations" :key="location.name" class="flex flex-col h-full"
            :ui="{ body: { class: 'flex-grow' } }">
            <template #header>
              <div
                class="h-48 w-full bg-gray-50 flex items-center justify-center overflow-hidden rounded-t-lg border-b border-gray-100">
                <img :alt="location.name" :src="`/api/public/image/${location.imgName}`"
                  class="h-full w-full object-cover block" />
              </div>
            </template>

            <div class="space-y-4">
              <div>
                <div class="flex items-center gap-2">
                  <a v-if="location.description" :href="location.description" target="_blank"
                    class="group flex items-center gap-1.5 text-primary-600 hover:text-primary-700 transition-colors">
                    <SharedTextCardTitle class="group-hover:underline">
                      {{ location.name }}
                    </SharedTextCardTitle>
                    <UIcon name="i-heroicons-arrow-top-right-on-square" class="text-sm opacity-50" />
                  </a>
                  <SharedTextCardTitle v-else>
                    {{ location.name }}
                  </SharedTextCardTitle>
                </div>

                <SharedTextBase class="text-xs text-gray-500">
                  {{ location.address }}
                </SharedTextBase>
              </div>

              <UTable :data="getTableData(location.categoryCounts)" :columns="tableColumns"
                :ui="{ th: { base: 'text-[10px]' }, td: { base: 'py-2 text-sm' } }" empty="No bags" />
            </div>

            <template #footer>
              <div class="flex justify-between items-center">
                <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">Stock Level</span>
                <UBadge variant="outline" color="primary" size="md">
                  Total: {{ location.emergencyBags }}
                </UBadge>
              </div>
            </template>
          </UCard>
        </div>

        <footer class="mt-12">
          <USeparator class="mb-6" />
          <div class="flex gap-3 items-start">
            <UIcon name="i-heroicons-information-circle" class="text-gray-400 text-xl mt-0.5" />
            <SharedTextBase class="text-sm text-gray-600">
              <strong>*</strong> Not 100% nut-free
            </SharedTextBase>
          </div>
        </footer>

      </section>
    </UContainer>
  </div>
</template>

<script setup lang="ts">

interface LocationData {
  name: string
  address: string
  imgName: string
  description: string
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
  { header: "Bag Category", accessorKey: "category", type: "text" },
  { header: "Quantity Available", accessorKey: "count", type: "text" },
]

const activeLocations = computed(() => {
  return locations.value?.filter(loc => !loc.archived) ?? []
})

const tableColumns = buildNuxtUITable(columnsDef, {})

const countdown = ref(180)
let interval

const refreshNow = () => {
  reloadNuxtApp()
}

onMounted(() => {
  interval = setInterval(() => {
    countdown.value--

    if (countdown.value <= 0) {
      refreshNow()
      countdown.value = 60
    }
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(interval)
})

</script>