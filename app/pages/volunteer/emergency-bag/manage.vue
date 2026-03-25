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
                        
                    </section>
                </template>
                <!--END OF ADD BAG STUFF-->

                <!--START OF VIEW/MODIFY BAG STUFF-->
                <template #view>
                    <section>
                        <div class="p-2  text-white flex flex-col gap-2 md:justify-between md:flex-row">
                            <UInput
                                v-model="manage_searchQuery"
                                :icon="icons['search']"
                                placeholder="Search items"
                                class="w-full md:w-72"
                            />
                            <div class="flex justify-between">
                                <UInputMenu :disabled="selectedBagIDs.length === 0" v-model="moveLocation" :items="moveLocations" />
                                <UButton :disabled="selectedBagIDs.length === 0" 
                                :icon="icons['move']" size="xs" variant="solid"
                                @click="moveBags"
                                >
                                    Move
                                </UButton>
                            </div>
                        </div>
                        
                        <UTable  sticky v-model:expanded="expanded" v-model:rowSelection="selected"
                        :getRowId="row => row.bagID" :data="filtered_viewData" :columns="columns"
                        :ui="{
                            td: 'py-2',
                            th: 'py-2',
                            tr: 'text-sm'
                        }"
                        >
                            <template #expanded="{ row }">
                                <div class="p-4 flex flex-col gap-2">
                                    <div>
                                        <p class="">Internal ID:</p>
                                        <p class="">{{ row.original.bagID }}</p>
                                    </div>

                                    <div>
                                        <p class="">Category:</p>
                                        <p class="">
                                        {{ row.original.bagCategory }}
                                        </p>
                                    </div>

                                    <div>
                                        <p class="">Expiry Date:</p>
                                        <p class="">
                                        {{ row.original.expiryDate || 'N/A' }}
                                        </p>
                                    </div>

                                    <div>
                                        <p class="">Location:</p>
                                        <p class="">
                                        {{ row.original.locationName || 'N/A' }}
                                        </p>
                                    </div>

                                    <div class="flex gap-2 items-center">
                                        <UInputMenu v-model="row.original._moveLocation" :items="moveLocations" class="w-48"/>

                                        <UButton
                                        size="xs"
                                        :icon="icons['move']"
                                        variant="solid"
                                        @click="moveSingleBag(row.original.bagID, row.original._moveLocation)"
                                        >
                                        Move
                                        </UButton>
                                    </div>

                                    <UModal :dismissible="false">
                                        <!--//Would have used SharedButtonCancel but I wanted it in red-->
                                        <UButton label="Delete Bag" size="xs" color="error" class="self-start"/>

                                        <template #content="{close}">
                                            <UCard>
                                            <h3 class="text-lg font-semibold text-red-600">
                                                Confirm Delete
                                            </h3>

                                            <p class="text-sm text-gray-600 mt-2">
                                                Are you sure you want to delete this bag?
                                            </p>

                                            <div class="flex justify-end gap-2 mt-4">
                                                <UButton variant="ghost" @click="close">Cancel</UButton>
                                                <!--//Would have used SharedButtonCancel but I wanted it in red-->
                                                <UButton color="error" @click="deleteBag(row.original.bagID, close)">Delete</UButton>
                                            </div>
                                            </UCard>
                                        </template>
                                    </UModal>

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
const { data: emergencyBags, refresh: refreshEmergencyBags } = await useFetch('/api/volunteer/emergency-bag/emergencyBags');
const expanded = ref({})
const selected = ref({})

const moveLocations = ref(['Activity Center', 'Police Station']) //Need to make it use Location get
const moveLocation = ref('Activity Center')

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
  {header: 'Category',accessorKey: 'bagCategory',type: 'text', 
    cell: ({ row }) => categoryMap[row.original.bagCategory] ?? row.original.bagCategory},
  /*{
    type: 'edit',icon: icons['edit'],
    onClick: (row) => {  console.log('To implement...')},
    meta: {class: {th: 'w-12 hidden md:table-cell', td: 'w-12 hidden md:table-cell'}}
  },*/
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
  return Object.keys(selected.value).filter(id => selected.value[id]);
})

const moveBags = async() => {
    for (const bagID of selectedBagIDs.value) {
        try {
            await fetch("/api/volunteer/emergency-bag/emergencyBagsMove", {
                method: "PATCH",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({
                bagID,
                location: moveLocation.value
                })
            })
        } catch (err) {
        console.error(`Failed for ${bagID}`, err)
        }
  }

    await refreshEmergencyBags();
    selected.value = {};
}

const moveSingleBag = async(bagID, location) => {
    try {
        await fetch("/api/volunteer/emergency-bag/emergencyBagsMove", {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
                bagID,
                location
            })
        })
    } catch (err) {
    console.error(`Failed for ${bagID}`, err)
    }
    await refreshEmergencyBags();
}

const deleteBag = async(bagID,close) => {
    try {
        await fetch('/api/volunteer/emergency-bag/emergencyBags', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bagID })
        })

        await refreshEmergencyBags()
        close()

    } catch (err) {
        console.error(err)
    }
    selected.value = {};
}

</script>
