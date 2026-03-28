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
						<div class="grid grid-cols-2 gap-6">
							<!-- LEFT SIDE: Search -->
							<div class="bg-white rounded-lg shadow-lg overflow-hidden">
								<!-- Header -->
								<div class="bg-final-utd-green text-white text-center py-3">
									<h2 class="text-2xl font-bold">Search Product</h2>
								</div>

								<!-- Search Bar -->
								<div class="p-6">
									<div class="flex items-center bg-gray-100 rounded-lg px-4 py-3">
										<UIcon name="i-lucide-search" class="w-5 h-5 text-gray-400" />
										<input
											type="text"
											placeholder="Search items"
											class="bg-gray-100 ml-3 flex-1 outline-none text-gray-700"
										/>
									</div>
								</div>

								<!-- Product Table Header -->
								<div class="grid grid-cols-2 bg-final-page-bg text-white px-6 py-2">
									<div class="font-semibold text-gray-700">Product</div>
									<div class="font-semibold  text-gray-700 text-right  ">Inventory</div>
								</div>

								<!-- Product List -->
								<div class="overflow-y-auto max-h-96 px-6 py-4 space-y-3">
									<div class="text-center text-gray-500 py-8">
										Search results will appear here
									</div>
								</div>
							</div>

							<!-- RIGHT SIDE: Bag editor -->
							<div class="grid grid-rows-2 space-y-4">
								<!-- BUBBLE 1: Current Bag Items -->
								<div class="bg-white rounded-lg flex-1 shadow-lg overflow-hidden">
									<div class="bg-final-utd-green text-white px-6 py-3 font-semibold">
										Current Bag
									</div>
									<div class="overflow-y-auto h-40 p-6 space-y-3">
										<div class="text-center text-gray-500">
											No items in bag yet
										</div>
									</div>
								</div>

                                <div class="grid grid-cols-2 gap-4">
                                <!-- BUBBLE 2: Category Selection -->
									<div class="bg-white rounded-lg shadow-lg p-6">
										<div class="text-lg font-semibold text-gray-700 mb-3">Category</div>
										<div class="space-y-2">
											<button 
												@click="selectedCategory = 'VEGETARIAN_AND_NON_PEANUT_BUTTER'"
												:class="selectedCategory === 'VEGETARIAN_AND_NON_PEANUT_BUTTER' ? 'bg-orange-600 text-white font-semibold' : 'bg-gray-300 text-gray-700'"
												class="w-full py-2 rounded hover:opacity-80 transition text-sm"
											>
												Vegetarian + Nut-Free*
											</button>
											<button 
												@click="selectedCategory = 'NONVEGETARIAN_AND_NON_PEANUT_BUTTER'"
												:class="selectedCategory === 'NONVEGETARIAN_AND_NON_PEANUT_BUTTER' ? 'bg-orange-600 text-white font-semibold' : 'bg-gray-300 text-gray-700'"
												class="w-full py-2 rounded hover:opacity-80 transition text-sm"
											>
												Non-Vegetarian + Nut-Free*
											</button>
											<button 
												@click="selectedCategory = 'VEGETARIAN_AND_PEANUT_BUTTER'"
												:class="selectedCategory === 'VEGETARIAN_AND_PEANUT_BUTTER' ? 'bg-orange-600 text-white font-semibold' : 'bg-gray-300 text-gray-700'"
												class="w-full py-2 rounded hover:opacity-80 transition text-sm"
											>
												Vegetarian + Not Nut-Free*
											</button>
											<button 
												@click="selectedCategory = 'NONVEGETARIAN_AND_PEANUT_BUTTER'"
												:class="selectedCategory === 'NONVEGETARIAN_AND_PEANUT_BUTTER' ? 'bg-orange-600 text-white font-semibold' : 'bg-gray-300 text-gray-700'"
												class="w-full py-2 rounded hover:opacity-80 transition text-sm"
											>
												Non-Vegetarian + Not Nut-Free*
											</button>
										</div>
									</div>

                                    <div class="grid grid-rows-2 gap-4">
									<!-- BUBBLE 3: Expiry Date -->
									<div class="bg-white rounded-lg shadow-lg p-6">
                                            <div class="text-lg font-semibold text-gray-700 mb-3">Expiry Date</div>
                                            <input
                                                v-model="selectedExpiryDate"
                                                type="text"
                                                placeholder="MM    /    DD    /    YY"
                                                class="w-full border-b-2 border-gray-400 px-3 py-2 text-center text-gray-700 outline-none focus:border-orange-600"
                                            />
                                        </div>
                                    
                                        <!-- BUBBLE 4: Confirm Button -->
                                        <div class="bg-white rounded-lg shadow-lg p-2 h-17 items-center justify-center">
                                            <button class="w-full bg-orange-600 text-white text-xl font-bold py-3 rounded hover:bg-orange-700 transition">
                                            Confirm Bag
                                        </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
					</section>
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
// Category Selection
const selectedCategory = ref<string | null>(null)
const selectedExpiryDate = ref('')

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
        await $fetch('/api/volunteer/emergency-bag/emergencyBag', {
            method: 'DELETE',
            body: { bagID }
        })

        await refreshEmergencyBags()
        close()

    } catch (err) {
        console.error(err)
    }
    selected.value = {};
}

</script>
