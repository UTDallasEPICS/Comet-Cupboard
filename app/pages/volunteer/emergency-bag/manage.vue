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
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
							
                            <!-- LEFT SIDE: Search -->
							<UCard>
								<!-- Header -->
								<template #header>
                                    <div class="bg-final-utd-green text-white text-center px-6 py-3 rounded">
                                        <h2 class="text-xl font-bold">Search Product</h2>
                                    </div>
                                </template>
								<!-- Search Bar -->
									<div class="bg-gray-100 rounded-lg px-4 py-3">
                                    <UInput
                                        v-model="searchQuery"
                                        icon="i-lucide-search"
                                        placeholder="Search items"
                                        variant="outline"
                                        class="w-full"
                                    />
                                    </div>

								<!-- Product List -->
								<div class="overflow-y-auto h-fit max-h-124 px-3 py-3 space-y-3">
                                    <div v-if="!filteredItems?.length" class="text-center text-gray-500 py-8">
                                        Search results will appear here
                                    </div>
                                    <div v-for="item in filteredItems || []" :key="item.itemID" class="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-100 p-3 rounded gap-3">
                                        <!-- Image -->
                                            <img  
                                                v-if="item.imgName && item.categoryName"
                                                :src="`/test-images/${encodeURIComponent(item.categoryName)}/${item.imgName}`"
                                                :alt="item.name"
                                                class="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                                            />
                                            <div v-else class="w-12 h-12 bg-gray-300 rounded flex items-center justify-center">
                                                <span class="text-gray-500 text-xs">No Img</span>
                                            </div>
                                        
                                        <!-- Item Info -->
                                        <div class="flex-1">
                                            <p class="font-semibold">{{ item.name }}</p>
                                            <p class="text-sm text-gray-600">
                                                Available: {{ getAvailableQuantity(item.itemID) }} / {{ item.quantity }}
                                            </p>
                                        </div>
                                        
                                        <!-- Add Button -->
                                        <UButton
                                        size="sm"
                                        :disabled="getAvailableQuantity(item.itemID) <= 0"
                                        class="bg-final-utd-green text-white px-3 py-1 text-sm"
                                        @click="addItemToBag(item)"
                                        >
                                        + Add
                                        </UButton>

                                    </div>
                                </div>
							</UCard>

							<!-- RIGHT SIDE: Bag editor -->
							<div class="flex flex-col gap-4">
								
                                <!-- Current Bag Items -->
								<UCard class="flex-1 min-h-0">
									<template #header>
                                        <div class="bg-final-utd-green flex-1 text-white text-center px-6 py-3 rounded">
										    <h2 class="text-xl font-bold">Current Bag</h2>
                                        </div>
									</template>
                                    <div class="overflow-y-auto h-54 space-y-3">
                                        <div v-if="bagItems.length === 0" class="text-center text-gray-500">
                                            No items in bag yet
                                        </div>
                                        <div v-for="item in bagItems" :key="item.itemID" class="flex items-center justify-between bg-gray-100 p-3 rounded">
                                            <div>
                                                <p class="font-semibold text-sm">{{ item.name }}</p>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <UButton class="bg-gray-400 px-2 py-1 rounded hover:bg-gray-500" @click="decreaseItemCount(item.itemID)">−</UButton>
                                                <span class="w-6 text-center font-semibold">{{ item.count }}</span>
                                                <UButton class="bg-gray-400 px-2 py-1 rounded hover:bg-gray-500" @click="increaseItemCount(item.itemID)">+</UButton>
                                                <UButton class="bg-orange-600 px-2 py-1 rounded hover:bg-gray-500" @click="removeItemFromBag(item.itemID)">✕</UButton>
                                            </div>
                                        </div>
                                    </div>
								</UCard>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    
                                    <!--Category Selection -->
									<UCard>
										<template #header>
                                            <div class="text-xl font-bold text-center text-gray-700">Category</div>
                                        </template>
										<URadioGroup v-model="selectedCategory" size="md" variant="card" :items="categories" />
                                    </UCard>
                                    
                                    <div class="flex flex-col gap-4 h-full">
                                       
                                        <!--Expiry Date -->
                                        <UCard class="h-50 flex-1">
                                            <template #header>
                                                <div class="text-xl font-bold text-center flex-1 text-gray-700">Expiry Date</div>
                                            </template>
                                            <div class="flex h-full items-center justify-center">
                                                <UInputDate v-model="expiryDate" size="xl" icon="i-lucide-calendar" :min-value="minDate"/>
                                            </div>
                                        </UCard>
                                        
                                            <!--Confirm Button -->
                                            <UCard class="flex-none">
                                                <UButton
                                                label="Confirm Bag"
                                                block
                                                class="bg-orange-600 text-xl font-bold py-3 rounded hover:bg-orange-700 transition"
                                                @click="submitBag"
                                                />
                                            </UCard>
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
                        <div class="p-2 bg-final-cancel-gray text-white">
                            <UInput
                                v-model="manage_searchQuery"
                                :icon="icons['search']"
                                placeholder="Search items"
                                class="w-full md:w-72"
                            />
                        </div>
                        
                        <UTable
                        v-model:expanded="expanded"
                        v-model="selected"
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
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'

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

// Get emergency bags data (used by both Add and View tabs)
const { data: emergencyBags, refresh: refreshEmergencyBags } = await useFetch('/api/volunteer/emergency-bag/emergencyBags');

//===== ADD TAB =====

const categories = [
    {label:"Veg + PB", value: "VEGETARIAN_AND_PEANUT_BUTTER"},
    {label:"Veg + Non-PB" , value: "VEGETARIAN_AND_NON_PEANUT_BUTTER"},
    {label:"Non-Veg + PB" , value: "NONVEGETARIAN_AND_PEANUT_BUTTER"},
    {label:"Non-Veg + Non-PB", value: "NONVEGETARIAN_AND_NON_PEANUT_BUTTER"}
]
const selectedCategory = ref<string | null>(null)

//Search
const searchQuery = ref('')
const { data: volunteerItems } = await useFetch("/api/student/inventory/items")

const filteredItems = computed(() => {
	if (!volunteerItems.value) return []
	if (!searchQuery.value) return volunteerItems.value
	
	const query = searchQuery.value.toLowerCase()
	return volunteerItems.value.filter(item => 
		item.name.toLowerCase().startsWith(query)
	)
})

// Get available count for an item in inventory
const getAvailableQuantity = (itemID: string): number => {
	const item = volunteerItems.value?.find(i => i.itemID === itemID)
	const bagItem = bagItems.value.find(bi => bi.itemID === itemID)
	
	if (!item) return 0
	return item.quantity - (bagItem?.count || 0)
}

// Current bag items with counts
const bagItems = ref<Array<{ itemID: string; count: number; name: string }>>([])

// Add item to bag or increase count
const addItemToBag = (item: any) => {
	const existingItem = bagItems.value.find(bi => bi.itemID === item.itemID)
	if (existingItem) {
		existingItem.count++
	} else {
		bagItems.value.push({
			itemID: item.itemID,
			count: 1,
			name: item.name
		})
	}
}

// Remove item from bag
const removeItemFromBag = (itemID: string) => {
	bagItems.value = bagItems.value.filter(item => item.itemID !== itemID)
}

// Decrease count or remove if count reaches 0
const decreaseItemCount = (itemID: string) => {
	const item = bagItems.value.find(bi => bi.itemID === itemID)
	if (item) {
		if (item.count === 1) {
			removeItemFromBag(itemID)
		} else {
			item.count--
		}
	}
}

//Increase item count
const increaseItemCount = (itemID: string) => {
	const item = bagItems.value.find(bi => bi.itemID === itemID)
	if (item) {
		item.count++
	}
}

// Expiry Date - Minimum 1 week after current date
const minDate = today(getLocalTimeZone()).add({ days: 7 })
const expiryDate = shallowRef(minDate)


//Submit bag
const submitBag = async () => {
    if (!selectedCategory.value) {
        alert('Please select a category')
        return
    }

    if (!expiryDate.value) {
        alert('Please select an expiry date')
        return
    }

    if (bagItems.value.length === 0) {
        alert('Please add items to the bag')
        return
    }

  //Convert CalendarDate -> ISO string (midnight UTC)
  const y = expiryDate.value.year
  const m = String(expiryDate.value.month).padStart(2, '0')
  const d = String(expiryDate.value.day).padStart(2, '0')
  const isoDate = new Date(`${y}-${m}-${d}T00:00:00Z`).toISOString()

	try {

		const response = await $fetch('/api/volunteer/emergency-bag/emergencyBags', {
			method: 'POST',
			body: {
				bagCategory: selectedCategory.value,
				expiryDate: isoDate,
				items: bagItems.value.map(item => ({
					itemID: item.itemID,
					count: item.count
				}))
			}
		})

		console.log('Bag created successfully!', response)
		
		// Reset form
		selectedCategory.value = null
		bagItems.value = []
        expiryDate.value = minDate
		searchQuery.value = ''
		
		// Refresh bags list
        await refreshEmergencyBags()

        volunteerItems.value = await $fetch("/api/student/inventory/items")

        alert('Bag created successfully!')
		
	} catch (err: any) {
		console.error('Failed to create bag:', err)
		alert(`Error: ${err.message || 'Failed to create bag'}`)
	}
}

//===== VIEW TAB =====

const expanded = ref({})
const selected = ref({})

const columnsDef = [
  {header: '', type: 'checkbox', accessorKey: 'selected'},
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

</script>
