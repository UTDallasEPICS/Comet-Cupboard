<template>
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
                    <div class="bg-gray-100 rounded-t-lg px-4 py-3">
                    <UInput
                        v-model="searchQuery"
                        icon="i-lucide-search"
                        placeholder="Search items"
                        variant="outline"
                        class="w-full"
                    />
                    </div>

                <!-- Product List -->
                <div class="overflow-y-auto h-fit max-h-150 px-3 py-3 space-y-3">
                    <div v-if="!filteredItems?.length" class="text-center text-gray-500 py-8">
                        Search results will appear here
                    </div>

                    <div
                        v-for="item in filteredItems || []"
                        :key="item.itemID"
                        :class="[
                        'flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded gap-3 transition',
                        getAvailableQuantity(item.itemID) <= 0
                            ? 'bg-gray-200 opacity-60 grayscale cursor-not-allowed'
                            : 'bg-gray-100'
                        ]"
                    >
                        <!-- Image -->
                            <img  
                                v-if="item.imgName && item.categoryName"
                                :src="`/api/public/image/${item.imgName}`"
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
                        <div v-if="bagItems.length === 0 && currentBagItems.length === 0" class="text-center text-gray-500">
                            No items in bag yet
                        </div>

                        <div
                        v-if="currentBagItems.length > 0 && bagItems.length > 0"
                        class="text-xs"
                        >
                        New Items:
                        </div>
                        <div v-for="item in bagItems" :key="item.itemID" class="flex items-center justify-between bg-gray-100 p-3 rounded">
                            <BagItems
                                :item="item"
                                @increase="increaseItemCount"
                                @decrease="decreaseItemCount"
                                @remove="removeItemFromBag"
                            />
                        </div>

                        <!--For Current Bag Items-->
                        <div
                        v-if="currentBagItems.length > 0"
                        class="text-xs"
                        >
                        Current Emergency Bag Items:
                        </div>
                        <div v-for="item in currentBagItems" :key="item.itemID" class="flex items-center justify-between bg-gray-100 p-3 rounded">
                            <BagItems
                                :item="item"
                                @increase="(id) => increaseItemCount(id, true)"
                                @decrease="(id) => decreaseItemCount(id, true)"
                                @remove="(id) => removeItemFromBag(id, true)"
                            />
                        </div>
                    </div>
                </UCard>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">

                    <!-- Category -->
                    <UCard>
                        <template #header>
                            <div class="text-xl font-bold text-center text-gray-700">Category</div>
                        </template>
                        <URadioGroup v-model="selectedCategory" size="md" variant="card" :items="categories" />
                    </UCard>

                    <!-- Right column: Expiry Date + Privacy stacked -->
                    <div class="flex flex-col gap-2">
                        <UCard>
                            <template #header>
                                <div class="text-xl font-bold text-center text-gray-700">Expiry Date</div>
                            </template>
                            <div class="flex items-center justify-center py-2">
                                <UInputDate v-model="expiryDate" size="xl" icon="i-lucide-calendar" :min-value="minDate"/>
                            </div>
                        </UCard>

                        <UCard v-if="canAdminAccess">
                            <template #header>
                                <div class="text-xl font-bold text-center text-gray-700">Privacy</div>
                            </template>
                            <URadioGroup v-model="selectedPrivacy" size="md" variant="card" :items="privacyOptions" />
                        </UCard>
                    </div>

                    <!-- Confirm Button-->
                    <UCard class="sm:col-span-2">
                        <UButton
                            :label="props.initialData ? 'Update Bag' : 'Confirm Bag'"
                            block
                            class="bg-final-utd-green text-xl font-bold py-3 rounded hover:bg-orange-700 transition"
                            @click="handleSubmit"
                        />
                    </UCard>

                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'
import BagItems from '~/components/EmergencyBag/BagItems.vue'

const props = defineProps<{
  initialData?: any
}>()

const emit = defineEmits(['submit'])

const { canAdminAccess } = storeToRefs(usePermissionsStore())

const privacyOptions = [{ label: 'Private', value: 'private' }]
const selectedPrivacy = ref<string | null>('private')

const categories = [
    {label:"Veg + PB", value: "VEGETARIAN_AND_PEANUT_BUTTER"},
    {label:"Veg + Non-PB" , value: "VEGETARIAN_AND_NON_PEANUT_BUTTER"},
    {label:"Non-Veg + PB" , value: "NONVEGETARIAN_AND_PEANUT_BUTTER"},
    {label:"Non-Veg + Non-PB", value: "NONVEGETARIAN_AND_NON_PEANUT_BUTTER"}
]
const selectedCategory = ref<string | null>(null)

//Search
const searchQuery = ref('')
const { data: volunteerItems, refresh: refreshItems} = await useFetch("/api/student/inventory/items")

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
    if (!item) return 0

    const newItem = bagItems.value.find(i => i.itemID === itemID)

    return item.quantity - (newItem?.count || 0)
}

// Current bag items with counts
const bagItems = ref<Array<{ itemID: string; count: number; name: string; imgName?: string }>>([])
//currentBagItems refers to current Emergency Bag Items. bagItems only refer to the newer items being added.
const currentBagItems = ref<Array<{ itemID: string; count: number; name: string; imgName?: string }>>([])

// Add item to bag or increase count
const addItemToBag = (item: any) => {
	const existingItem = bagItems.value.find(bi => bi.itemID === item.itemID)
	if (existingItem) {
		existingItem.count++
	} else {
		bagItems.value.push({
			itemID: item.itemID,
			count: 1,
			name: item.name,
            imgName: item.imgName
		})
	}
}

// Remove item from bag
const removeItemFromBag = (itemID: string, isCurrentBag: boolean = false) => {
    if(isCurrentBag){
        currentBagItems.value = currentBagItems.value.filter(item => item.itemID !== itemID)
    }else{
        bagItems.value = bagItems.value.filter(item => item.itemID !== itemID)
    }
	
}

// Decrease count or remove if count reaches 0
const decreaseItemCount = (itemID: string, isCurrentBag: boolean = false) => {
    if(isCurrentBag){
        const item = currentBagItems.value.find(i => i.itemID === itemID)
        if (!item) return

        if (item.count === 1) {
            currentBagItems.value = currentBagItems.value.filter(i => i.itemID !== itemID)
        } else {
            item.count--
        }
    }else{
        const item = bagItems.value.find(bi => bi.itemID === itemID)
        if (item) {
            if (item.count === 1) {
                removeItemFromBag(itemID)
            } else {
                item.count--
            }
        }
    }
	
}

//Increase item count
const increaseItemCount = (itemID: string, isCurrentBag: boolean = false) => {
    if(isCurrentBag){
        const item = currentBagItems.value.find(i => i.itemID === itemID)
        if (!item) return

        const original =
        props.initialData?.EmergencyBagItems?.find(i => i.itemID === itemID)?.count ?? 0

        if (item.count < original) {
        item.count++
        }
    }else{
        const item = bagItems.value.find(bi => bi.itemID === itemID)
        if (item) {
            item.count++
        }
    }
	
}

// Expiry Date - Minimum 1 week after current date
const minDate = today(getLocalTimeZone()).add({ days: 7 })
const expiryDate = shallowRef(minDate)

watchEffect(() => {
  if (!props.initialData) return

  const bag = props.initialData

  selectedCategory.value = bag.bagCategory
  selectedPrivacy.value = bag.private ? 'private' : null

  const d = new Date(bag.expiryDate)
  expiryDate.value = new CalendarDate(
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate()
  )

  currentBagItems.value = bag.EmergencyBagItems.map(item => ({
    itemID: item.itemID,
    count: item.count,
    name: item.Item.name,
    imgName: item.Item.imgName
  }))
})

const handleSubmit = async () => {
  await emit('submit', {
    _bagCategory: selectedCategory.value,
    _expiryDate: expiryDate.value,
    _items: bagItems.value,
    _oldItems: currentBagItems.value,
    _isPrivate: selectedPrivacy.value === 'private'
  })

  selectedCategory.value = null
  bagItems.value = []
  currentBagItems.value = []
  expiryDate.value = minDate
  searchQuery.value = ''
  selectedPrivacy.value = 'private'

  await refreshItems() // 🔥 refresh inventory
}

</script>