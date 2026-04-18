<template>
    <div class="w-full flex items-center justify-center p-6">
        <!--Tabs-->
        <UContainer>
            <UTabs
                v-model="activeTab"
                :items="items"
                :ui="{
                root: 'gap-0 border-2 border-final-border-soft rounded-lg',
                trigger: 'rounded-t-lg',
                content: 'rounded-b-lg p-0'
                }"
                >
                <!--START OF ADD BAG STUFF-->
                <template #add>
                    <BagEditor @submit="submitBag" />
                </template>
                <!--END OF ADD BAG STUFF-->

                <!--START OF VIEW/MODIFY BAG STUFF-->
                <template #view>
                    <section>
                        <div class="p-2 flex flex-col gap-2 md:justify-between md:flex-row">
                            <UInput
                                v-model="manage_searchQuery"
                                :icon="icons['search']"
                                placeholder="Search items"
                                class="w-full md:w-72"
                            />
                            <div v-if="selectedBagIDs.length > 0" class="flex justify-between">
                                <UInputMenu v-model="moveLocation" :items="moveLocations" />
                                <UButton  :icon="icons['move']" size="xs" variant="solid"
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
                                        <p class="">Private Bag:</p>
                                        <p class="">{{ row.original.private }}</p>
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
                                        {{ row.original.expiryDate ?
                                            new Date(row.original.expiryDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })
                                        : 'N/A'
                                        }}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <p>Items:</p>
                                        <div class="flex gap-2 flex-wrap">
                                            <div v-for="item in row.original.EmergencyBagItems" :key="item.itemID">
                                                <EmergencyBagItemCard
                                                    :name="item.Item.name"
                                                    :imgName="item.Item.imgName"
                                                    :qty="item.count"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <UButton
                                        size="xs"
                                        :icon="icons['edit']"
                                        variant="solid"
                                        @click="editBag(row.original)"
                                        >
                                        Edit Bag Contents
                                        </UButton>
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

                <!--START OF EDIT BAG-->
                <template #edit>
                    <BagEditor
                    :initialData="editingBag"
                    @submit="submitBag"
                    />
                </template>
                
                <!--END OF EDIT BAG-->
            </UTabs>
        </UContainer>

    </div>

</template>

<script lang="ts" setup>
import {resolveComponent } from 'vue'
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'
import BagEditor from '~/components/EmergencyBag/BagEditor.vue'

const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')

const resolvedComponents = {
  UButton: resolveComponent('UButton'),
  UCheckbox: resolveComponent('UCheckbox'),
  UDropdownMenu: resolveComponent('UDropdownMenu')
}

//Tabs Setup
const activeTab = ref('add')

const items = computed(() => {
  const base = [
    { label: 'Add New Bag', slot: 'add', value: 'add' },
    { label: 'View/Modify Bags', slot: 'view', value: 'view' }
  ]

  if (editingBag.value) {
    base.push({
      label: `Edit ${editingBag.value.label}`,
      slot: 'edit',
      value: 'edit'
    })
  }

  return base
})

//Search Query
const manage_searchQuery = ref('')

//Add Tab
//Submit bag
const submitBag = async (data) => {
    const { _bagCategory, _expiryDate, _items } = data
    if (!_bagCategory) {
        alert('Please select a category')
        return
    }

    if (!_expiryDate) {
        alert('Please select an expiry date')
        return
    }

    if (!_items.length) {
        alert('Please add items to the bag')
        return
    }

    //Convert CalendarDate -> ISO string (midnight UTC)
    const y = _expiryDate.year
    const m = String(_expiryDate.month).padStart(2, '0')
    const d = String(_expiryDate.day).padStart(2, '0')
    const isoDate = new Date(`${y}-${m}-${d}T00:00:00Z`).toISOString()

    const payload = {
        bagCategory: _bagCategory,
        expiryDate: isoDate,
        items: _items.map(item => ({
            itemID: item.itemID,
            count: item.count
        }))
    }

	try {
        let response
        let message

        if (activeTab.value === 'edit'){
            //console.log("EDITING BAGG");
            message = "Bag updated successfully!"
            editingBag.value = null;
            activeTab.value = "view"
        }else{
            response = await $fetch('/api/volunteer/emergency-bag/emergencyBags', {
                method: 'POST',
                body: {
                    bagCategory: _bagCategory,
                    expiryDate: isoDate,
                    items: _items.map(item => ({
                        itemID: item.itemID,
                        count: item.count
                    }))
                }
            })
            message = "Bag created successfully!"
        }
		 

		//console.log(message, response)
		
		// Refresh bags list
        await refreshEmergencyBags()
        //volunteerItems.value = await $fetch("/api/student/inventory/items")

        alert(message)
        
		
	} catch (err: any) {
		console.error('Failed to create bag:', err)
		alert(`Error: ${err.message || 'Failed to create bag'}`)
	}

    
}

//View Tab
const permissions = usePermissionsStore()
const { canAdminAccess } = storeToRefs(permissions)

const emergencyBagsEndpoint = computed(() =>
  canAdminAccess.value
    ? '/api/admin/emergency-bag/emergencyBags'
    : '/api/volunteer/emergency-bag/emergencyBags'
)

const { data: emergencyBags, refresh: refreshEmergencyBags } = await useFetch(emergencyBagsEndpoint);
const expanded = ref({})
const selected = ref({})

const {data: _moveLocations} = await useFetch('/api/volunteer/location');
const moveLocations = computed(() => {
  return _moveLocations.value?.map(loc => loc.name) ?? []
})
const moveLocation = ref('')


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
  {header: 'Private',accessorKey: 'private',type: 'text',sortable: true,
    cell: ({ row }) => row.original.private ? 'Yes' : 'No'
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
  return Object.keys(selected.value).filter(id => selected.value[id]);
})

const moveBags = async() => {
    try {
        await $fetch("/api/volunteer/emergency-bag/emergencyBagsMove", {
        method: "PATCH",
        body: {
            bagIDs: selectedBagIDs.value,
            location: moveLocation.value
        }
        })

        await refreshEmergencyBags()
        selected.value = {}

    } catch (err) {
        console.error("Failed to move bags", err)
    }

    await refreshEmergencyBags();
    selected.value = {};
}

const moveSingleBag = async(bagID, location) => {
    try {
        await $fetch("/api/volunteer/emergency-bag/emergencyBagsMove", {
        method: "PATCH",
        body: {
            bagIDs: [bagID],
            location
        }
        })

    } catch (err) {
        console.error(`Failed for ${bagID}`, err)
    }
    await refreshEmergencyBags();
}

const deleteBag = async(bagID,close) => {
    try {
        await $fetch('/api/volunteer/emergency-bag/emergencyBagArchive', {
            method: 'POST',
            body: { bagID }
        })

        await refreshEmergencyBags()
        close()

    } catch (err) {
        console.error(err)
    }
    selected.value = {};
}

const editingBag = ref(null)

const editBag = (bag) => {
  editingBag.value = bag
  activeTab.value = 'edit'
}

</script>
