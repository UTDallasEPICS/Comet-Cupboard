<template>
    <div class="w-full flex items-center justify-center p-6">
        <!--Tabs-->
        <UContainer>
            <UTabs
                :items="items"
                :ui="{
                root: 'gap-0 border-2 border-final-border-soft rounded-lg',
                trigger: 'rounded-t-lg',
                content: 'rounded-b-lg p-0'
                }"
                >
                <!--START OF ADD BAG STUFF-->
                <template #add>
                    <section>
                        <div class="p-2 bg-final-cancel-gray text-white">
                            <UInput
                                v-model="manage_searchQuery"
                                :icon="icons['search']"
                                placeholder="Search items"
                                class="w-full md:w-72"
                            />
                        </div>
                        Add New Bag content
                    </section>
                </template>
                <!--END OF ADD BAG STUFF-->

                <!--START OF VIEW/MODIFY BAG STUFF-->
                <template #view>
                    <section>
                        <div class="p-2 bg-final-cancel-gray text-white flex flex-col gap-2 md:justify-between md:flex-row">
                            <UInput
                                v-model="manage_searchQuery"
                                :icon="icons['search']"
                                placeholder="Search items"
                                class="w-full md:w-72"
                            />
                            <UButton :disabled="selectedBagIDs.length === 0" :icon="icons['move']" size="xs" variant="solid">Move</UButton>
                        </div>
                        
                        <UTable 
                        sticky
                        v-model:expanded="expanded"
                        v-model:rowSelection="selected"
                        selection="multiple"
                        :getRowId="row => row.bagID"
                        :data="filtered_viewData"
                        :columns="columns"
                        :ui="{
                            td: 'py-2',
                            th: 'py-2',
                            tr: 'text-sm'
                        }"
                        >
                            <template #expanded="{ row }">
                                <div class="p-4">
                                To Implement...
                                </div>
                            </template>
                        </UTable>
                    </section>
                </template>
                <!--END OF VIEW/MODIFY BAG STUFF-->
            </UTabs>
        </UContainer>
    </div>
</template>

<script lang="ts" setup>
import {resolveComponent } from 'vue'

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')

const resolvedComponents = {
  UButton: resolveComponent('UButton'),
  UCheckbox: resolveComponent('UCheckbox'),
  UDropdownMenu: resolveComponent('UDropdownMenu')
}

//Tabs Setup
const items = [
  { label: 'Add New Bag', slot: 'add' },
  { label: 'View/Modify Bags', slot: 'view' }
]

//Search Query
const manage_searchQuery = ref('')

//Add Tab

//View Tab
const { data: emergencyBags } = await useFetch('/api/volunteer/emergency-bag/emergencyBags');
const expanded = ref({})
const selected = ref({})

console.log(emergencyBags);

const columnsDef = [
  {
    header: ({ table }) =>
        h(resolvedComponents.UCheckbox, {
            modelValue: table
            ? table.getIsAllRowsSelected()
                ? true
                : table.getIsSomeRowsSelected()
                ? 'indeterminate'
                : false
            : false,
            'onUpdate:modelValue': (val) => table?.toggleAllRowsSelected(val),
        }),
    type: 'checkbox2'
},
  {header: 'Bag ID',accessorKey: 'label',type: 'text',sortable: true},
  {header: 'Location',accessorKey: 'locationName',type: 'text'},
  {header: 'Category',accessorKey: 'bagCategory',type: 'text'},
  {
    type: 'edit',icon: icons['edit'],
    onClick: (row) => {  console.log('To implement...')},
    meta: {class: {th: 'w-12 hidden md:table-cell', td: 'w-12 hidden md:table-cell'}}
  },
  {type: "expand", meta: {class: {th: "w-12", td: "w-12"}}}
]

const columns = buildNuxtUITable(columnsDef, resolvedComponents)

const categoryMap: Record<string, string> = {
    'VEGETARIAN_AND_PEANUT_BUTTER' : 'Veg_PB',
    'VEGETARIAN_AND_NON_PEANUT_BUTTER' : 'Veg_NoPB',
    'NONVEGETARIAN_AND_PEANUT_BUTTER' : 'NonVeg_PB',
    'NONVEGETARIAN_AND_NON_PEANUT_BUTTER' : 'NonVeg_NoPB'
}

const filtered_viewData = computed(() => {
  if (!emergencyBags.value) return []

  const view_query = manage_searchQuery.value.toLowerCase().trim()

  return emergencyBags.value.filter((bag) => {
    const categoryShort =
      categoryMap[bag.bagCategory] ?? bag.bagCategory

    if (!view_query) return true

    return (
      bag.label?.toLowerCase().includes(view_query) ||
      bag.locationName?.toLowerCase().includes(view_query) ||
      categoryShort.toLowerCase().includes(view_query)
    )
  })
})

const selectedBagIDs = computed(() => {
  console.log( Object.keys(selected.value).filter(id => selected.value[id]));
  return Object.keys(selected.value).filter(id => selected.value[id]);
})

</script>
