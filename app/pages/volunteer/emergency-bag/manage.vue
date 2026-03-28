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
							<div class="bg-white rounded-lg shadow-lg overflow-hidden">
								<!-- Header -->
								<div class="bg-final-utd-green text-white text-center py-3">
									<h2 class="text-2xl font-bold">Search Product</h2>
								</div>

								<!-- Search Bar -->
								<div class="p-3 sm:p-4 md:p-6">
									<div class="flex items-center bg-gray-100 rounded-lg px-4 py-3">
										<UIcon name="i-lucide-search" class="w-5 h-5 text-gray-400" />
										<input
                                            v-model="searchQuery"
                                            type="text"
                                            placeholder="Search items"
                                            class="bg-gray-100 ml-3 flex-1 outline-none text-gray-700"
                                        />
									</div>
								</div>

								<!-- Product Table Header -->
								<div class="grid grid-cols-2 bg-final-page-bg text-white px-6 py-2">
									<div class="font-semibold text-gray-700">Product</div>
								</div>

								<!-- Product List -->
								<div class="overflow-y-auto max-h-96 px-6 py-4 space-y-3">
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
                                        <button
                                            @click="addItemToBag(item)"
                                            :disabled="getAvailableQuantity(item.itemID) <= 0"
                                            class="bg-final-utd-green text-white px-3 py-1 rounded hover:opacity-80 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                        >
                                            + Add
                                        </button>
                                    </div>
                                </div>
							</div>

							<!-- RIGHT SIDE: Bag editor -->
							<div class="grid grid-rows-2 gap-4 auto-rows-max">
								<!-- BUBBLE 1: Current Bag Items -->
								<div class="bg-white rounded-lg flex-1 shadow-lg overflow-hidden">
									<div class="bg-final-utd-green text-white px-6 py-3 font-semibold">
										Current Bag
									</div>
									<div class="overflow-y-auto h-40 p-3 sm:p-4 md:p-6 space-y-3">
                                        <div v-if="bagItems.length === 0" class="text-center text-gray-500">
                                            No items in bag yet
                                        </div>
                                        <div v-for="item in bagItems" :key="item.itemID" class="flex items-center justify-between bg-gray-100 p-3 rounded">
                                            <div>
                                                <p class="font-semibold text-sm">{{ item.name }}</p>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <button
                                                    @click="decreaseItemCount(item.itemID)"
                                                    class="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500 transition"
                                                >
                                                    −
                                                </button>
                                                <span class="w-6 text-center font-semibold">{{ item.count }}</span>
                                                <button
                                                    @click="increaseItemCount(item.itemID)"
                                                    class="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500 transition"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    @click="removeItemFromBag(item.itemID)"
                                                    class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    </div>
								</div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                                                placeholder="MM/DD/YY"
                                                maxlength="8"
                                                @input="formatExpiryDate"
                                                class="w-full border-b-2 border-gray-400 px-3 py-2 text-center text-gray-700 outline-none focus:border-orange-600"
                                            />
                                        </div>
                                    
                                        <!-- BUBBLE 4: Confirm Button -->
                                        <div class="bg-white rounded-lg shadow-lg p-2 h-17 items-center justify-center">
                                            <button 
                                                @click="submitBag"
                                                class="w-full bg-orange-600 text-white text-xl font-bold py-3 rounded hover:bg-orange-700 transition"
                                            >
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

// Get emergency bags data (used by both Add and View tabs)
const { data: emergencyBags, refresh: refreshEmergencyBags } = await useFetch('/api/volunteer/emergency-bag/emergencyBags');

//===== ADD TAB =====

// Category Selection
const selectedCategory = ref<string | null>(null)
const selectedExpiryDate = ref('')

// Search functionality
const searchQuery = ref('')
const { data: volunteerItems } = await useFetch("/api/student/inventory/items")

// Starts with matching - only show items that start with search term
const filteredItems = computed(() => {
	if (!volunteerItems.value) return []
	if (!searchQuery.value) return volunteerItems.value
	
	const query = searchQuery.value.toLowerCase()
	return volunteerItems.value.filter(item => 
		item.name.toLowerCase().startsWith(query)
	)
})

// Get available quantity for an item (inventory - what's in bag)
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

// Increase item count
const increaseItemCount = (itemID: string) => {
	const item = bagItems.value.find(bi => bi.itemID === itemID)
	if (item) {
		item.count++
	}
}

// Format expiry date input to MM/DD/YY
const formatExpiryDate = () => {
	let value = selectedExpiryDate.value.replace(/\D/g, '') // Remove non-digits
	
	if (value.length >= 2) {
		value = value.slice(0, 2) + '/' + value.slice(2)
	}
	if (value.length >= 5) {
		value = value.slice(0, 5) + '/' + value.slice(5, 7)
	}
	
	selectedExpiryDate.value = value
}

// Validate expiry date format
const isValidExpiryDate = (date: string): boolean => {
	const regex = /^(0[1-9]|1[0-2])\/([0-2][0-9]|3[0-1])\/\d{2}$/
	if (!regex.test(date)) return false
	
	const [month, day] = date.split('/')
	return parseInt(month) >= 1 && parseInt(month) <= 12 && parseInt(day) >= 1 && parseInt(day) <= 31
}

// Submit bag to API
const submitBag = async () => {
	if (!selectedCategory.value) {
		alert('Please select a category')
		return
	}
	if (!selectedExpiryDate.value) {
		alert('Please enter an expiry date (MM/DD/YY)')
		return
	}
	if (!isValidExpiryDate(selectedExpiryDate.value)) {
		alert('Invalid date format. Use MM/DD/YY')
		return
	}
	if (bagItems.value.length === 0) {
		alert('Please add items to the bag')
		return
	}

	try {
		// Convert MM/DD/YY to ISO 8601 datetime
		const [month, day, year] = selectedExpiryDate.value.split('/')
		const fullYear = `20${year}`
		const isoDate = new Date(`${fullYear}-${month}-${day}T00:00:00Z`).toISOString()

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
		selectedExpiryDate.value = ''
		bagItems.value = []
		searchQuery.value = ''
		
		// Refresh bags list
        await refreshEmergencyBags()

        // Force refresh items by using $fetch instead of useFetch
        const updatedItems = await $fetch("/api/student/inventory/items")
        volunteerItems.value = updatedItems

        // Refetch items to get updated inventory
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
