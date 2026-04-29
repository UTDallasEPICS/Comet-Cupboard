<template>
    <header>
			<SharedButtonNavigateBack text="Back to Dashboard" :to="{ path: '/volunteer' }" />
	</header>
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
                <!--Tab Trigger-->
                <template #default="{ item }">
                    <div class="flex items-center gap-2" :data-tour="`tab-${item.value}`">
                        <span>{{ item.label }}</span>
                        <button
                            v-if="item.value === 'edit'"
                            class="hover:cursor-pointer"
                            @click.stop="closeEditTab"
                        >
                            ✕
                        </button>
                    </div>
                </template>

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
                                <ExpandedRow
                                    :key="row.original.bagID"
                                    :bag="row.original"
                                    :moveLocations="moveLocations"
                                    :icons="icons"

                                    @move="moveSingleBag"
                                    @edit="editBag"
                                    @delete="deleteBag"
                                />
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
import BagEditor from '~/components/EmergencyBag/BagEditor.vue'
import ExpandedRow from '~/components/EmergencyBag/ExpandedRow.vue'

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
    { label: 'Add Bag', slot: 'add', value: 'add' },
    { label: 'View Bags', slot: 'view', value: 'view' }
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

const closeEditTab = () => {
  editingBag.value = null
  activeTab.value = 'view'
}

//Search Query
const manage_searchQuery = ref('')

//Add Tab
//Submit bag
const submitBag = async (data) => {
    const { _bagCategory, _expiryDate, _items, _oldItems } = data
    if (!_bagCategory) {
        alert('Please select a category')
        return
    }

    if (!_expiryDate) {
        alert('Please select an expiry date')
        return
    }

    if (!_items.length && activeTab.value === 'add') {
        alert('Please add items to the bag')
        return
    }

    //Convert CalendarDate -> ISO string (midnight UTC)
    const y = _expiryDate.year
    const m = String(_expiryDate.month).padStart(2, '0')
    const d = String(_expiryDate.day).padStart(2, '0')
    const isoDate = new Date(`${y}-${m}-${d}T00:00:00Z`).toISOString()

	try {
        let response
        let message

        if (activeTab.value === 'edit'){
            //console.log("EDITING BAGG");
            response = await $fetch('/api/volunteer/emergency-bag/emergencyBagEdit', {
                method: 'PUT',
                body: {
                    bagID: editingBag.value?.bagID,
                    bagCategory: _bagCategory,
                    expiryDate: isoDate,
                    items: _items.map(item => ({
                        itemID: item.itemID,
                        count: item.count
                    })),
                    oldItems: _oldItems.map(item => ({
                        itemID: item.itemID,
                        count: item.count
                    }))
                }
            })
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
