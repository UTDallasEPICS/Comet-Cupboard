<template>
    <section>

        <!-- ======= MOBILE: 2-step tab layout (hidden on md+) ======= -->
        <div class="block md:hidden">
            <UTabs
                v-model="mobileActiveTab"
                :items="mobileTabItems"
                :ui="{
                    root: 'gap-0 border-2 border-final-border-soft rounded-lg',
                    trigger: 'rounded-t-lg',
                    content: 'rounded-b-lg p-0'
                }"
            >
                <!-- Step 1: Add Items -->
                <template #items>
                    <div class="flex flex-col gap-4 p-3">
                        <BagEditorSearchPanel
                            ref="mobileSearchPanelRef"
                            :inventory-items="volunteerItems"
                            :bag-items="bagItems"
                            :current-bag-items="currentBagItems"
                            @add="addItemToBag"
                        />
                        <BagEditorItemsList
                            :bag-items="bagItems"
                            :current-bag-items="currentBagItems"
                            @increase="increaseItemCount"
                            @decrease="decreaseItemCount"
                            @remove="removeItemFromBag"
                        />
                    </div>
                </template>

                <!-- Step 2: Configure -->
                <template #configure>
                    <div class="p-3">
                        <BagEditorConfigPanel
                            v-model:selected-category="selectedCategory"
                            v-model:selected-privacy="selectedPrivacy"
                            v-model:expiry-date="expiryDate"
                            :min-date="minDate"
                            :can-admin-access="canAdminAccess"
                            :is-edit-mode="!!props.initialData"
                            @submit="handleSubmit"
                        />
                    </div>
                </template>
            </UTabs>
        </div>

        <!-- ======= DESKTOP: 2-column grid layout (hidden on mobile) ======= -->
        <div class="hidden md:grid md:grid-cols-2 gap-4">

            <!-- LEFT SIDE: Search -->
            <BagEditorSearchPanel
                ref="desktopSearchPanelRef"
                :inventory-items="volunteerItems"
                :bag-items="bagItems"
                :current-bag-items="currentBagItems"
                @add="addItemToBag"
            />

            <!-- RIGHT SIDE: Bag editor -->
            <div class="flex flex-col gap-4">
                <BagEditorItemsList
                    :bag-items="bagItems"
                    :current-bag-items="currentBagItems"
                    @increase="increaseItemCount"
                    @decrease="decreaseItemCount"
                    @remove="removeItemFromBag"
                />
                <BagEditorConfigPanel
                    v-model:selected-category="selectedCategory"
                    v-model:selected-privacy="selectedPrivacy"
                    v-model:expiry-date="expiryDate"
                    :min-date="minDate"
                    :can-admin-access="canAdminAccess"
                    :is-edit-mode="!!props.initialData"
                    @submit="handleSubmit"
                />
            </div>
        </div>

    </section>
</template>

<script setup lang="ts">
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'
import BagEditorSearchPanel from '~/components/EmergencyBag/BagEditorSearchPanel.vue'
import BagEditorItemsList from '~/components/EmergencyBag/BagEditorItemsList.vue'
import BagEditorConfigPanel from '~/components/EmergencyBag/BagEditorConfigPanel.vue'

const props = defineProps<{
  initialData?: any
}>()

const emit = defineEmits(['submit'])

const { canAdminAccess } = storeToRefs(usePermissionsStore())

const selectedPrivacy = ref<string | null>('private')
const selectedCategory = ref<string | null>(null)
const mobileActiveTab = ref('items')

type BagItem = { itemID: string; count: number; name: string; imgName?: string }

const bagItems = ref<BagItem[]>([])
const currentBagItems = ref<BagItem[]>([])

const totalItemCount = computed(() =>
  bagItems.value.reduce((sum, i) => sum + i.count, 0) +
  currentBagItems.value.reduce((sum, i) => sum + i.count, 0)
)

const addItemToBag = (item: any) => {
  const existing = bagItems.value.find(bi => bi.itemID === item.itemID)
  if (existing) { existing.count++ }
  else { bagItems.value.push({ itemID: item.itemID, count: 1, name: item.name, imgName: item.imgName }) }
}

const removeItemFromBag = (itemID: string, isCurrentBag = false) => {
  if (isCurrentBag) { currentBagItems.value = currentBagItems.value.filter(i => i.itemID !== itemID) }
  else { bagItems.value = bagItems.value.filter(i => i.itemID !== itemID) }
}

const decreaseItemCount = (itemID: string, isCurrentBag = false) => {
  if (isCurrentBag) {
    const item = currentBagItems.value.find(i => i.itemID === itemID)
    if (!item) return
    if (item.count === 1) { currentBagItems.value = currentBagItems.value.filter(i => i.itemID !== itemID) }
    else { item.count-- }
  } else {
    const item = bagItems.value.find(i => i.itemID === itemID)
    if (!item) return
    if (item.count === 1) { removeItemFromBag(itemID) }
    else { item.count-- }
  }
}

const increaseItemCount = (itemID: string, isCurrentBag = false) => {
  if (isCurrentBag) {
    const item = currentBagItems.value.find(i => i.itemID === itemID)
    if (!item) return
    const original = props.initialData?.EmergencyBagItems?.find((i: any) => i.itemID === itemID)?.count ?? 0
    if (item.count < original) item.count++
  } else {
    const item = bagItems.value.find(i => i.itemID === itemID)
    if (item) item.count++
  }
}

const resetItems = () => {
  bagItems.value = []
  currentBagItems.value = []
}

watchEffect(() => {
  if (!props.initialData) return
  currentBagItems.value = props.initialData.EmergencyBagItems.map((item: any) => ({
    itemID: item.itemID,
    count: item.count,
    name: item.Item.name,
    imgName: item.Item.imgName
  }))
})

const mobileTabItems = computed(() => [
    {
        label: totalItemCount.value > 0 ? `Add Items (${totalItemCount.value})` : 'Add Items',
        slot: 'items',
        value: 'items'
    },
    { label: 'Configure', slot: 'configure', value: 'configure' }
])

const { data: volunteerItems, refresh: refreshItems } = await useFetch('/api/student/inventory/items')

const minDate = today(getLocalTimeZone()).add({ days: 7 })
const expiryDate = shallowRef(minDate)

watchEffect(() => {
  if (!props.initialData) return
  const bag = props.initialData
  selectedCategory.value = bag.bagCategory
  selectedPrivacy.value = bag.private ? 'private' : null
  const d = new Date(bag.expiryDate)
  expiryDate.value = new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
})

interface SearchPanelExpose { resetSearch: () => void }
const mobileSearchPanelRef = ref<SearchPanelExpose | null>(null)
const desktopSearchPanelRef = ref<SearchPanelExpose | null>(null)

const handleSubmit = async () => {
  await emit('submit', {
    _bagCategory: selectedCategory.value,
    _expiryDate: expiryDate.value,
    _items: bagItems.value,
    _oldItems: currentBagItems.value,
    _isPrivate: selectedPrivacy.value === 'private'
  })

  selectedCategory.value = null
  resetItems()
  expiryDate.value = minDate
  mobileSearchPanelRef.value?.resetSearch()
  desktopSearchPanelRef.value?.resetSearch()
  selectedPrivacy.value = 'private'
  mobileActiveTab.value = 'items'

  await refreshItems()
}
</script>
